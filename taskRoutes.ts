import express from "express";
import { Task } from "./models";
import { client } from "./main";

export const taskRoutes = express.Router();

taskRoutes.get("/cms", async function (req, res) {
  const result = await client.query(`SELECT * FROM task`);
  const memos: Task[] = result.rows;
  res.json(memos);
});

taskRoutes.put("/apply/:taskId", async function (req, res) {
  const taskId = parseInt(req.params.taskId);
  const applyUserId = req.body.applied_user_id;

  console.log(taskId, applyUserId);
});
