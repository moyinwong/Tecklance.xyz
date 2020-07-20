import express from "express";
import { Task } from "./models";
import { client } from "./main";
// import { Usertask } from "./models";

export const taskRoutes = express.Router();

taskRoutes.get("/tasks", async (req, res) => {
  let result = await client.query("SELECT * FROM task");
  let tasks: Task[] = result.rows;
  res.json(tasks);
  // console.log(tasks)
});

//insert application data into database
taskRoutes.put("/apply/:taskId", async function (req, res) {
  const taskId = parseInt(req.params.taskId);
  const applyUserId = req.body.applied_user_id;

  await client.query(
    /*sql*/`INSERT INTO applied_post (user_id, task_id) VALUES ($1, $2);`,
    [applyUserId, taskId]
  );
  
});

//getting all applied task of that particular user
taskRoutes.get('/usertask/:userId', async function(req, res) {
  let userId = parseInt(req.params.userId);
  
  let result = await client.query(`SELECT *
  FROM applied_post
      JOIN task on task.id = applied_post.task_id
      JOIN users on users.id = applied_post.user_id
          WHERE user_id = $1;`, [userId])

  let userTasks = result.rows;
  res.json(userTasks);
})

//getting all applied task of that particular creator
taskRoutes.get("/posted_task/:creator_id", async (req, res) => {
  let creator_id = parseInt(req.params.creator_id);
  let result = await client.query(`SELECT * FROM task WHERE creator_id = $1`,[creator_id]);
  let postedTasks: Task[] = result.rows;
  res.json(postedTasks);
  // console.log(tasks)
});