import express from "express";
import { User } from "./models";
import { client, upload } from "./main";
import { checkPassword, hashPassword } from "./hash";
import fetch from "node-fetch";
import { logger } from "./logger";

export const userRoutes = express.Router();

//check PW and login
userRoutes.post("/login", async (req, res, next) => {
  try {
    //read SQL server table users
    const userEmailEntered: string = req.body.email;

    const passwordEntered: string = req.body.password;

    let users = (
      await client.query(/*sql*/ `SELECT * FROM users WHERE email = $1`, [
        userEmailEntered,
      ])
    ).rows;

    const user: User = users[0];
    if (!user) {
      console.log("user does not exist");
      return res.status(401).send("user is not exist");
    }

    //use hash check password
    const pwIsCorrect = await checkPassword(passwordEntered, user.password);

    if (req.session && pwIsCorrect) {
      req.session.userId = user.id;
      console.log(user.username + " successfully login");
      return res.json({ success: true });
    }
    console.log("password is not correct login failed");
    return res.status(401).send("password is not correct");
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
});

//check if is logged in
userRoutes.get("/current-user", async function (req, res) {
  try {
    if (req.session && req.session.userId) {
      console.log(req.session);

      let users = (
        await client.query(/*sql*/ `SELECT * FROM users WHERE id = $1`, [
          req.session.userId,
        ])
      ).rows;

      const user: User = users[0];

      return res.status(200).json(user.username);
    } else {
      console.log("not logged in");
      return res.status(401).json({ message: "Not logged in" });
    }
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
});

//login with google
userRoutes.get("/login/google", loginGoogle);

async function loginGoogle(req: express.Request, res: express.Response) {
  try {
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

    //to check what information we can use
    logger.debug(result);

    const users = (
      await client.query(
        /*sql*/ `SELECT * FROM users WHERE users.google = $1`,
        [result.email]
      )
    ).rows;

    const user: User = users[0];

    if (!user) {
      const tempInformation: Object = {
        id: null,
        username: null,
        password: null,
        image: null,
        email: result.email,
        google: result.email,
        github: null,
        gitlab: null,
        first_name: result.given_name,
        last_name: result.family_name,
        created_at: null,
        updated_at: null,
      };
      if (req.session) {
        req.session.temp = tempInformation;
      }
      return res.redirect("/signup.html");
    }
    if (req.session) {
      req.session.userId = user.id;
    }
    console.log(user.username + " successfully login by Google");
    return res.redirect("/");
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
}

//login with github
userRoutes.get("/login/github", loginGithub);

async function loginGithub(req: express.Request, res: express.Response) {
  try {
    const accessToken = req.session?.grant.response.access_token;

    //The access token allows you to make requests to the API on a behalf of a user.
    const fetchRes = await fetch("https://api.github.com/user", {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await fetchRes.json();

    //to check what information we can use
    logger.debug(result);

    const users = (
      await client.query(
        /*sql*/ `SELECT * FROM users WHERE users.github = $1`,
        [result.id]
      )
    ).rows;

    const user = users[0];

    if (!user) {
      const tempInformation: Object = {
        id: null,
        username: null,
        password: null,
        image: null,
        email: result.email,
        google: null,
        github: result.id,
        gitlab: null,
        first_name: result.given_name,
        last_name: result.family_name,
        created_at: null,
        updated_at: null,
      };
      if (req.session) {
        req.session.temp = tempInformation;
      }
      return res.redirect("/signup.html");
    }
    if (req.session) {
      req.session.userId = user.id;
    }
    console.log(user.username + " successfully login by Github");
    return res.redirect("/");
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
}

//login with gitlab
userRoutes.get("/login/gitlab", loginGitlab);

async function loginGitlab(req: express.Request, res: express.Response) {
  try {
    const accessToken = req.session?.grant.response.access_token;

    //The access token allows you to make requests to the API on a behalf of a user.
    const fetchRes = await fetch("https://gitlab.com/api/v4/user", {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await fetchRes.json();

    //to check what information we can use
    logger.debug(result);

    const users = (
      await client.query(
        /*sql*/ `SELECT * FROM users WHERE users.gitlab = $1`,
        [result.id]
      )
    ).rows;
    const user = users[0];
    if (!user) {
      const tempInformation: Object = {
        id: null,
        username: null,
        password: null,
        image: null,
        email: result.email,
        google: null,
        github: null,
        gitlab: result.id,
        first_name: result.name.split(" ")[0],
        last_name: result.name.replace(result.name.split(" ")[0], ""),
        created_at: null,
        updated_at: null,
      };
      if (req.session) {
        req.session.temp = tempInformation;
      }
      return res.redirect("/signup.html");
    }
    console.log(user.username + " successfully login by Gitlab");
    return res.redirect("/");
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
}

//logout
userRoutes.get("/logout", async function (req, res) {
  try {
    if (req.session) {
      delete req.session.userId;
    }
    logger.debug(req.session);
    return res.redirect("/");
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
});

//create user
userRoutes.post("/signup", upload.single("image"), async function (req, res) {
  try {
    const {
      username,
      email,
      first_name,
      last_name,
      google,
      github,
      gitlab,
    } = req.body;

    const password = await hashPassword(req.body.password);

    let image: string | null;
    if (req.file) {
      image = req.file.filename;
    } else {
      image = null;
    }

    //check duplicate username
    const duplicateUsername = (
      await client.query(/*sql*/ `SELECT * FROM users WHERE username = $1`, [
        username,
      ])
    ).rows[0];

    if (duplicateUsername) {
      return res.status(400).json("username is already exists");
    }

    //insert user into sql
    await client.query(
      /*sql*/ `INSERT INTO users (username,password,email,google,github,gitlab,image,first_name,last_name,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW());`,
      [
        username,
        password,
        email,
        google,
        github,
        gitlab,
        image,
        first_name,
        last_name,
      ]
    );

    const userId = client.query(
      /*sql*/ `SELECT * FROM users WHERE username=$1`,
      [username]
    );

    //put the userID in session
    if (req.session) {
      req.session.userId = userId;
    }

    //clear temp info
    if (req.session && req.session.temp) {
      delete req.session.temp;
    }

    console.log(req.session);

    return res.status(201).json("User is successfully created");
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
});

//get temp info
userRoutes.get("/getTempInfo", function (req, res) {
  try {
    if (req.session && req.session.temp) {
      return res.json(req.session.temp);
    }
    return res.json({
      id: null,
      username: null,
      password: null,
      image: null,
      email: null,
      google: null,
      github: null,
      gitlab: null,
      first_name: null,
      last_name: null,
      created_at: null,
      updated_at: null,
    });
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
});
