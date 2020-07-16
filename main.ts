import express from "express";
import expressSession from "express-session";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";
import bodyParser from "body-parser";
import grant from "grant-express";
dotenv.config();

//configuring database setting
export const client = new pg.Client({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: "localhost",
});

//connecting to database
client.connect();
//setting up web server app
const app = express();

//set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//use session
app.use(
  expressSession({
    secret: "Tecky Academy teaches typescript",
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

//get method for displaying particular task page
app.get("/task/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  let result = await client.query(`SELECT * FROM task WHERE id = $1`, [id]);
  let task: Task[] = result.rows;
  res.json(task[0]);
  console.log(task[0]);
});

//get method for loading all tasks from database
app.get("/tasks", async (req, res) => {
  let result = await client.query("SELECT * FROM task");
  let tasks: Task[] = result.rows;
  res.json(tasks);
  // console.log(tasks)
});

//create task
app.post("/create-task", async (req, res) => {
  try {
    await client.query(
      /*sql*/
      `INSERT INTO task (title, content, category) VALUES
  ($1,$2,$3);`,
      [req.body.title, req.body.content, req.body.category]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(401);
  }
});

// get public/index.html
app.use(express.static("public"));

import { userRoutes } from "./userRoutes";
app.use("/", userRoutes);

//get method for loading all tasks from database
app.get("/createtask", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "./public/create_task.html"));
  } catch (err) {
    console.log(err);
  }
});

//redirect to login page
app.get("/loginpage", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "./public/login.html"));
  } catch (err) {
    console.log(err);
  }
});

//redirect to 404 page
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "./public/404.html"));
});

app.listen(8080, () => {
  console.log(`Listening at http://localhost:8080/`);
});

//add type checking for task info returned fromm database
interface Task {
  id: number;
  title: string;
  category: string;
  content: string;
}
