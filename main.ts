import express from "express";
import expressSession from "express-session";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";
import bodyParser from "body-parser";
import multer from "multer";
import grant from "grant-express";
import { Task } from "./models";
import { isLoggedIn } from "./guards";
import { logger } from "./logger";
dotenv.config();

//configuring database setting
export const client = new pg.Client({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //host: "localhost",
});

//connecting to database
client.connect();

//setting up web server app
const app = express();

//storage file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/uploads`);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

export const upload = multer({ storage });

//storage file
const taskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/admin/task_submission`);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.originalname.substring(
        0,
        file.originalname.lastIndexOf(".")
      )}-${Date.now()}.${file.mimetype.split("/")[1]}`
    );
  },
});

export const taskSubmission = multer({ storage: taskStorage });

//use session
app.use(
  expressSession({
    secret: "Tecklance",
    resave: true,
    saveUninitialized: true,
  })
);

//user grant for google login
app.use(
  grant({
    defaults: {
      protocol: "http",
      host: "localhost:8080",
      transport: "session",
      state: true,
    },
    google: {
      key: process.env.GOOGLE_CLIENT_ID || "",
      secret: process.env.GOOGLE_CLIENT_SECRET || "",
      scope: ["profile", "email"],
      callback: "/login/google",
    },
    github: {
      key: process.env.GITHUB_CLIENT_ID || "",
      secret: process.env.GITHUB_CLIENT_SECRET || "",
      scope: ["profile", "email"],
      callback: "/login/github",
    },
    gitlab: {
      key: process.env.GITLAB_CLIENT_ID || "",
      secret: process.env.GITLAB_CLIENT_SECRET || "",
      scope: ["read_user"],
      callback: "/login/gitlab",
    },
  })
);

//set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//get method for loading all tasks from database
app.get("/tasks", async (req, res) => {
  let result = await client.query("SELECT * FROM task WHERE status = 'open'");
  let tasks: Task[] = result.rows;
  res.json(tasks);
  // console.log(tasks)
});

//get method for loading freelancers from database
app.get("/freelancers", async (req, res) => {
  try {
    let result = await client.query(
      `SELECT * FROM users WHERE freelancer_intro IS NOT NULL`
    );
    let freelancers = result.rows;
    res.json(freelancers);
  } catch (err) {
    logger.error(err);
  }
});

// get public/index.html
app.use(express.static("public"));

import { userRoutes } from "./userRoutes";
import { paymentRoutes } from "./paymentRoutes";
import { taskRoutes } from "./taskRoutes";
import { messageRoutes } from "./messageRoutes";

app.use("/", userRoutes);
app.use("/", paymentRoutes);
app.use("/", taskRoutes);
app.use("/", messageRoutes);

//redirect to login page
// no use
app.get("/loginpage", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "./public/login.html"));
  } catch (err) {
    logger.error(err);
  }
});

//getting tasks of particular category
// search task by category
// can be merged with /tasks
app.get("/category", async (req, res) => {
  let category = req.query.category;
  let result = await client.query(
    `SELECT * FROM task WHERE category = $1 AND status = 'open'`,
    [category]
  );
  let categoryResult = result.rows;
  res.json(categoryResult);
});

// app.get("/categories", async (req, res) => {
//   res.sendFile(path.join(__dirname, `./public/category.html`));
// });

// same as /categpries
app.get("/about", async (req, res) => {
  res.sendFile(path.join(__dirname, "./public/about.html"));
});

//serve dashboard if user is logged in
app.use("/admin", isLoggedIn, express.static("admin"));

app.listen(8080, () => {
  logger.info(`Listening at http://localhost:8080/`);
});

//redirect to 404 page
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "./public/404.html"));
});
