import express from "express";
// import { Task } from "./models";
import { client, upload } from "./main";
import { Usertask } from "./models";

export const taskRoutes = express.Router();

// taskRoutes.get("/tasks/:userId", async (req, res) => {
//   let user = (req.params.creator_id).toString();
//   let result = await client.query(/*sql*/ `SELECT * FROM task where creator_id = $1`,
//   [user]);
//   let tasks: Task[] = result.rows;
//   res.json(tasks);
//   // console.log(tasks)
// });

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
taskRoutes.post("/create-task/:user", upload.single("image"), async (req, res) => {
  let email = (req.params.user).toString();
  try {
    const { title, content, category } = req.body;

    let image: string | "";
    if (req.file) {
      image = req.file.filename;
    } else {
      image = "";
    }
    await client.query(
      /*sql*/ `INSERT INTO task (title, content, category, image_task, creator_id) VALUES
    ($1,$2,$3,$4, (SELECT id from users where email = $5 LIMIT 1))`,
      [title, content, category, image, email]
    );

    //
    //
    //
    //Add response after created
    //
    //
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(401);
  }
});
