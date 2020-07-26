import express from "express";
import { User } from "./models";
import { client, upload } from "./main";
import { checkPassword, hashPassword } from "./hash";
import fetch from "node-fetch";
import { logger } from "./logger";
import fs from "fs";

export const userRoutes = express.Router();

const checkDuplicate = async (username: string, email: string, res) => {
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
    await client.query(/*sql*/ `SELECT * FROM users WHERE email = $1`, [email])
  ).rows[0];

  if (duplicateUserEmail) {
    return res.status(400).json("Email is already registered");
  }
  return;
};

const blankInfo = {
  id: 0,
  username: "",
  password: "",
  image: "",
  email: "",
  remain_amt: 0,
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
      return res.status(401).json("user does not exist");
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
      //console.log(req.session);

      let users = (
        await client.query(/*sql*/ `SELECT * FROM users WHERE id = $1`, [
          req.session.userId,
        ])
      ).rows;

      const user: User = users[0];

      return res.status(200).json({
        id: user.id,
        username: user.username,
        image_user: user.image_user,
        remain_amt: user.remain_amt,
      });
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
userRoutes.get("/login/:socialLoginMethod", socialLogin);

async function socialLogin(req, res) {
  try {
    const socialLoginMethod: string = req.params.socialLoginMethod;
    const getTokenAPI = async (socialLoginMethod) => {
      if (socialLoginMethod === "google") {
        return "https://www.googleapis.com/oauth2/v2/userinfo";
      } else if (socialLoginMethod === "github") {
        return "https://api.github.com/user";
      } else if (socialLoginMethod === "gitlab") {
        return "https://gitlab.com/api/v4/user";
      }
      return "";
    };

    const tokenAPI = await getTokenAPI(socialLoginMethod);

    const accessToken = req.session?.grant.response.access_token;
    const fetchRes = await fetch(tokenAPI, {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await fetchRes.json();

    //to check what information we can use
    logger.debug(result.id);

    const tempInformation = {
      id: 0,
      username: "",
      password: "",
      image: "",
      email: "",
      remain_amt: 0,
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

    //query users
    const getUserBySocialId = async (socialLoginMethod) => {
      if (socialLoginMethod === "google") {
        return await client.query(
          /*sql*/ `SELECT * FROM users WHERE users.google = $1`,
          [result.id]
        );
      } else if (socialLoginMethod === "github") {
        return await client.query(
          /*sql*/ `SELECT * FROM users WHERE users.github = $1`,
          [result.id]
        );
      } else {
        return await client.query(
          /*sql*/ `SELECT * FROM users WHERE users.gitlab = $1`,
          [result.id]
        );
      }
    };

    const user = (await getUserBySocialId(socialLoginMethod)).rows[0];

    //each social login will provide different info
    if (!user && socialLoginMethod === "google") {
      tempInformation.email = result.email;
      tempInformation.google = result.id;
      tempInformation.first_name = result.given_name;
      tempInformation.last_name = result.family_name;
    } else if (!user && socialLoginMethod === "github") {
      tempInformation.email = result.email;
      tempInformation.github = result.id;
      tempInformation.first_name = result.given_name;
      tempInformation.last_name = result.family_name;
    } else if (!user && socialLoginMethod === "gitlab") {
      tempInformation.email = result.email;
      tempInformation.gitlab = result.id;
      tempInformation.first_name = result.name.split(" ")[0];
      tempInformation.last_name = result.name.replace(
        result.name.split(" ")[0],
        ""
      );
    }

    if (!user && req.session) {
      req.session.temp = tempInformation;
      return res.redirect("/signup.html");
    }

    if (req.session) {
      req.session.userId = user.id;
    }
    logger.info(user.username + ` successfully login by ${socialLoginMethod}`);
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
      if (req.session.grant) {
        delete req.session.grant;
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

    //checking Duplicate Email & Username
    const checkResult = await checkDuplicate(username, email, res);

    //if duplicate, return it
    if (checkResult) {
      return checkResult;
    }

    console.log("hahahahaaha");

    //insert user into sql
    await client.query(
      /*sql*/ `INSERT INTO users (username,password,email,remain_amt,google,github,gitlab,image_user,first_name,last_name,bank_name,bank_account,freelancer_intro,isAdmin,created_at,updated_at) 
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

//edit user info
userRoutes.put("/editUserInfo", upload.single("image"), async function (
  req,
  res
) {
  try {
    const {
      username,
      email,
      first_name,
      last_name,
      bank_name,
      bank_account,
      freelancer_intro,
    } = req.body;

    const getUserSessionId = async () => {
      if (req.session) {
        return req.session.userId;
      }
    };

    const id = await getUserSessionId();

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

    //check duplicate name
    const duplicateEmail = (
      await client.query(
        /*sql*/ `SELECT * FROM users WHERE email = $1 AND id <> $2`,
        [email, id]
      )
    ).rows[0];

    if (duplicateEmail) {
      return res.status(400).json("Email is already registered");
    }

    //get user info
    const currentUser = (
      await client.query(/*sql*/ `SELECT * FROM users WHERE id=$1;`, [id])
    ).rows[0];

    //after checking user name, del image if new image is uploaded
    const currentImage: string = currentUser.image_user;

    let image: string | "";
    if (req.file) {
      image = req.file.filename;
      if (currentImage) {
        await fs.unlinkSync("./public/uploads/" + currentImage);
      }
    } else {
      image = currentImage;
    }

    //check image
    logger.debug(req.file);

    //insert user into sql
    await client.query(
      /*sql*/ `UPDATE users SET username=$1,image_user=$2,first_name=$3,last_name=$4,bank_name=$5,bank_account=$6,freelancer_intro=$7,email=$8,updated_at=NOW() WHERE id=$9;`,
      [
        username,
        image,
        first_name,
        last_name,
        bank_name,
        bank_account,
        freelancer_intro,
        email,
        id,
      ]
    );

    return res.status(201).json("User information is successfully updated");
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
});

//change password
userRoutes.put("/change-password", async (req, res) => {
  try {
    //read SQL server table users
    if (!req.session) {
      return res.status(401).json({ message: "Please login" });
    }
    const userId = req.session.userId;

    const current_password = req.body.current_password;

    const hashNewPassword = await hashPassword(req.body.password);

    let users = (
      await client.query(/*sql*/ `SELECT * FROM users WHERE id = $1`, [userId])
    ).rows;

    const user: User = users[0];
    if (!user) {
      logger.error("user does not exist");
      return res.status(401).json("user is not exist");
    }

    //use hash check password
    const pwIsCorrect = await checkPassword(current_password, user.password);

    if (!pwIsCorrect) {
      return res.status(401).json("Current password is wrong");
    }

    await client.query(
      /*sql*/ `UPDATE users SET password=$1, updated_at=NOW() WHERE id = $2`,
      [hashNewPassword, userId]
    );

    return res.status(200).json("Password was successful changed");
  } catch (err) {
    logger.error(err.toString());
    return res.status(500).json({ message: "internal Server Error" });
  }
});
