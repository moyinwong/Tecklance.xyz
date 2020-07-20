import express from "express";
import { Task } from "./models";
import { client } from "./main";

export const taskRoutes = express.Router();

taskRoutes.get("/cms", async function (req, res) {
  const result = await client.query(`SELECT * FROM task`);
  const memos: Task[] = result.rows;
  res.json(memos);
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
