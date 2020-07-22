import express from "express";
import { Task } from "./models";
import { client, upload } from "./main";
import { Usertask } from "./models";
import { logger } from "./logger";

export const taskRoutes = express.Router();

taskRoutes.get("/create-task/:user", async (req, res) => {
  let creator_id = req.params.user.toString();
  let result = await client.query(
    /*sql*/ `SELECT * FROM task where creator_id = $1`,
    [creator_id]
  );
  let tasks: Task[] = result.rows;
  res.json(tasks);
  // console.log(tasks)
});

//insert application data into database
taskRoutes.put("/apply/:taskId", async function (req, res) {
  const taskId = parseInt(req.params.taskId);
  const applyUserId = req.body.applied_user_id;

  await client.query(
    /*sql*/ `INSERT INTO applied_post (user_id, task_id) VALUES ($1, $2);`,
    [applyUserId, taskId]
  );
});

//getting all applied task of that particular user
taskRoutes.get("/usertask/:userId", async function (req, res) {
  let userId = parseInt(req.params.userId);

  let result = await client.query(
    `SELECT *
  FROM applied_post
      JOIN task on task.id = applied_post.task_id
      JOIN users on users.id = applied_post.user_id
          WHERE user_id = $1;`,
    [userId]
  );

  let userTasks: Usertask[] = result.rows;
  userTasks = result.rows;
  res.json(userTasks);
});

//create task
taskRoutes.post(
  "/create-task/:userId",
  upload.single("image"),
  async (req, res) => {
    let user_id = req.params.userId.toString();
    try {
      const { title, content, category, offered_amt, remain_amt } = req.body;

      let image: string | "";
      if (req.file) {
        image = req.file.filename;
      } else {
        image = "";
      }
      //update remaining amount
      await client.query(
        /*sql*/ `UPDATE users SET remain_amt = $1 WHERE id=$2`,
        [remain_amt - offered_amt, user_id]
      );

      //create task in SQL
      await client.query(
        /*sql*/ `INSERT INTO task (title, category, content, image_task, creator_id, offered_amt,status,created_at,updated_at) VALUES
    ($1,$2,$3,$4,$5, $6,'open',NOW(),NOW())`,
        [title, category, content, image, user_id, offered_amt]
      );

      return res
        .status(201)
        .json(
          "Task is successfully created. Will redirect to homepage automatically"
        );
    } catch (err) {
      logger.error(err.toString());
      return res.status(401).json(err);
    }
  }
);
