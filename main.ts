import express from "express";
import expressSession from "express-session";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

//configuring database setting
const client = new pg.Client({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: "localhost",
});

//connecting to database
client.connect();
//setting up web server app
const app = express();

//use session
app.use(
  expressSession({
    secret: "Tecky Academy teaches typescript",
    resave: true,
    saveUninitialized: true,
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

// get public/index.html
app.use(express.static("public"));

//get method for loading all tasks from database
app.get("/createtask", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "./public/create_task.html"));
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
