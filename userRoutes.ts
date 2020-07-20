import express from "express";
import { User } from "./models";
import { client, upload } from "./main";
import { checkPassword, hashPassword } from "./hash";
import fetch from "node-fetch";
import { logger } from "./logger";
import fs from "fs";

export const userRoutes = express.Router();

const blankInfo: User = {
  id: 0,
  username: "",
  password: "",
  image: "",
  email: "",
  popup_amt: 0,
  google: "",
  github: "",
  gitlab: "",
  first_name: "",
  last_name: "",
  bank_name: "",
  bank_account: "",
  freelancer_intro: "",
  isAdmin: false,
  created_at: "",
  updated_at: "",
};

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
      logger.error("user does not exist");
      return res.status(401).json("user is not exist");
    }

    //use hash check password
    const pwIsCorrect = await checkPassword(passwordEntered, user.password);

    if (req.session && pwIsCorrect) {
      req.session.userId = user.id;
      logger.info(user.username + " successfully login");
      return res.json({ success: true });
    }
    logger.info("password is not correct login failed");
    return res.status(401).json("password is not correct");
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
});

//check if is logged in
userRoutes.get("/current-user", async function (req, res) {
  try {
    if (req.session && req.session.userId) {
      logger.debug(req.session);

      let users = (
        await client.query(/*sql*/ `SELECT * FROM users WHERE id = $1`, [
          req.session.userId,
        ])
      ).rows;

      const user: User = users[0];

      return res.status(200).json(user.username);
    } else {
      logger.info("not logged in");
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
        [result.id]
      )
    ).rows;

    const user: User = users[0];
    const tempInformation = blankInfo;
    if (!user) {
      tempInformation.email = result.email;
      tempInformation.google = result.id;
      tempInformation.first_name = result.given_name;
      tempInformation.last_name = result.family_name;

      if (req.session) {
        req.session.temp = tempInformation;
      }
      return res.redirect("/signup.html");
    }
    if (req.session) {
      req.session.userId = user.id;
    }
    logger.info(user.username + " successfully login by Google");
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
    const tempInformation = blankInfo;
    if (!user) {
      tempInformation.email = result.email;
      tempInformation.github = result.id;
      tempInformation.first_name = result.given_name;
      tempInformation.last_name = result.family_name;

      if (req.session) {
        req.session.temp = tempInformation;
      }
      return res.redirect("/signup.html");
    }
    if (req.session) {
      req.session.userId = user.id;
    }
    logger.info(user.username + " successfully login by Github");
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
    const tempInformation = blankInfo;
    if (!user) {
      tempInformation.email = result.email;
      tempInformation.gitlab = result.id;
      tempInformation.first_name = result.name.split(" ")[0];
      tempInformation.last_name = result.name.replace(
        result.name.split(" ")[0],
        ""
      );

      if (req.session) {
        req.session.temp = tempInformation;
      }
      return res.redirect("/signup.html");
    }
    if (req.session) {
      req.session.userId = user.id;
    }
    logger.info(user.username + " successfully login by Gitlab");
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
      if (req.session.temp) {
        delete req.session.temp;
      }
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
      bank_name,
      bank_account,
      freelancer_intro,
    } = req.body;

    const password = await hashPassword(req.body.password);

    let image: string | "";
    if (req.file) {
      image = req.file.filename;
    } else {
      image = "";
    }

    //check duplicate name
    const duplicateUsername = (
      await client.query(/*sql*/ `SELECT * FROM users WHERE username = $1`, [
        username,
      ])
    ).rows[0];

    if (duplicateUsername) {
      return res.status(400).json("username is already exists");
    }

    //check duplicate email
    const duplicateUserEmail = (
      await client.query(/*sql*/ `SELECT * FROM users WHERE email = $1`, [
        email,
      ])
    ).rows[0];

    if (duplicateUserEmail) {
      return res.status(400).json("Email is already registered");
    }

    //insert user into sql
    await client.query(
      /*sql*/ `INSERT INTO users (username,password,email,popup_amt,google,github,gitlab,image,first_name,last_name,bank_name,bank_account,freelancer_intro,isAdmin,created_at,updated_at) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,FALSE,NOW(),NOW());`,
      [
        username,
        password,
        email,
        0,
        google,
        github,
        gitlab,
        image,
        first_name,
        last_name,
        bank_name,
        bank_account,
        freelancer_intro,
      ]
    );

    const users = await client.query(
      /*sql*/ `SELECT * FROM users WHERE username=$1`,
      [username]
    );

    const user = users.rows[0];

    const userId = user.id;

    //put the userID in session
    if (req.session) {
      req.session.userId = userId;
    }

    //clear temp info
    if (req.session && req.session.temp) {
      delete req.session.temp;
    }

    logger.debug(req.session);

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
    return res.json(blankInfo);
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
});

userRoutes.get("/getUserId", function (req, res) {
  try {
    if (req.session && req.session.userId) {
      return res.status(200).json(req.session.userId);
    }
    return res.status(401).json({ message: "Please login" });
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
});

//get full info
userRoutes.get("/getFullInfo", async function (req, res) {
  try {
    if (req.session && req.session.userId) {
      console.log(req.session);
      const user = (
        await client.query(/*sql*/ `SELECT * FROM users WHERE id=$1`, [
          req.session.userId,
        ])
      ).rows[0];
      delete user.password;
      return res.json(user);
    }
    return res.status(401).json({ message: "Please login" });
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
});

//create user
userRoutes.put("/editUserInfo", upload.single("image"), async function (
  req,
  res
) {
  try {
    const {
      username,
      first_name,
      last_name,
      bank_name,
      bank_account,
      freelancer_intro,
    } = req.body;

    const getUserSessionid = async () => {
      if (req.session) {
        return req.session.userId;
      }
    };

    const id = await getUserSessionid();

    //check duplicate name
    const duplicateUsername = (
      await client.query(
        /*sql*/ `SELECT * FROM users WHERE username = $1 AND id <> $2`,
        [username, id]
      )
    ).rows[0];

    if (duplicateUsername) {
      return res.status(400).json("username is already exists");
    }

    //get user info
    const currentUser = (
      await client.query(/*sql*/ `SELECT * FROM users WHERE id=$1;`, [id])
    ).rows[0];

    //after checking user name, del image if new image is uploaded
    const currentImage: string = currentUser.image;

    let image: string | "";
    if (req.file) {
      image = req.file.filename;
      await fs.unlinkSync("./public/uploads/" + currentImage);
    } else {
      image = "";
    }

    //insert user into sql
    await client.query(
      /*sql*/ `UPDATE users SET username=$1,image=$2,first_name=$3,last_name=$4,bank_name=$5,bank_account=$6,freelancer_intro=$7 WHERE id=$8;`,
      [
        username,
        image,
        first_name,
        last_name,
        bank_name,
        bank_account,
        freelancer_intro,
        id,
      ]
    );

    return res.status(201).json("User information is successfully updated");
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
});
