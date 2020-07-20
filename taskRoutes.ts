import express from "express";
import { Task } from "./models";
import { client } from "./main";

export const taskRoutes = express.Router();

taskRoutes.get("/tasks", async (req, res) => {
  let result = await client.query("SELECT * FROM task");
  let tasks: Task[] = result.rows;
  res.json(tasks);
  // console.log(tasks)
});

taskRoutes.put("/apply/:taskId", async function (req, res) {
  const taskId = parseInt(req.params.taskId);
  const applyUserId = req.body.applied_user_id;

  console.log(taskId, applyUserId);
});
