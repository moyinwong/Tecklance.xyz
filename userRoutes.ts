import express from "express";
import { User } from "./models";
import { client } from "./main";
import { checkPassword } from "./hash";
import fetch from "node-fetch";

export const userRoutes = express.Router();

//check PW and login
userRoutes.post("/login", async (req, res, next) => {
  //read SQL server table users
  const userEmailEntered: string = req.body.email;

  const passwordEntered: string = req.body.password;

  let users: User = await (
    await client.query(/*sql*/ `SELECT * FROM users WHERE email = $1`, [
      userEmailEntered,
    ])
  ).rows[0];

  //use hash check password
  const pwIsCorrect = await checkPassword(passwordEntered, users.password);

  if (req.session && pwIsCorrect) {
    req.session.user = req.body.email;
    console.log(users.username + " successfully login");
    res.json({ success: true });
  } else {
    console.log("login failed");
    res.sendStatus(401).json({ success: false });
  }
});

//check if is logged in
userRoutes.get("/current-user", function (req, res) {
  console.log(req.session);
  if (req.session && req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

//login with google
userRoutes.get("/login/google", loginGoogle);

async function loginGoogle(req: express.Request, res: express.Response) {
  const accessToken = req.session?.grant.response.access_token;
  const fetchRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const result = await fetchRes.json();
  const users = (
    await client.query(/*sql*/ `SELECT * FROM users WHERE users.email = $1`, [
      result.email,
    ])
  ).rows;
  const user = users[0];
  if (!user) {
    return res.status(401).json({ success: false });
  }
  if (req.session) {
    req.session.user = {
      id: user.id,
    };
  }
  console.log(user.username + " successfully login by Google");
  return res.redirect("/");
}

//logout
userRoutes.get("/logout", async function (
  req: express.Request,
  res: express.Response
) {
  if (req.session) {
    delete req.session.user;
  }
  res.redirect("/");
});
