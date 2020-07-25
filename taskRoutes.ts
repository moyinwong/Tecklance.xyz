import express from "express";
import { Task } from "./models";
import { client, upload, taskSubmission } from "./main";
import { Usertask } from "./models";
import { logger } from "./logger";

export const taskRoutes = express.Router();

//getting all applied task of that particular user
taskRoutes.get("/usertask/:userId", async function (req, res) {
  let userId = parseInt(req.params.userId);

  let result = await client.query(
    /* sql */`SELECT *
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

//get all tasks created by a particular user
taskRoutes.get("/create-task/:user", async (req, res) => {
  let creator_id = parseInt(req.params.user);
  let result = await client.query(
    /*sql*/ `SELECT * FROM task where creator_id = $1`,
    [creator_id]
  );
  let tasks: Task[] = result.rows;
  res.json(tasks);
  // console.log(tasks)
});

//get method for displaying particular task page
taskRoutes.get("/task/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  let result = await client.query(/* sql */`SELECT * FROM task WHERE id = $1`, [id]);
  let task: Task[] = result.rows;
  res.json(task[0]);
  console.log(task[0]);
});

//get all applicants of a particular task
taskRoutes.get("/task/applicants/:taskId", async (req, res) => {
  try {
    let id = parseInt(req.params.taskId);

    let result = await client.query(
      `
    SELECT * FROM applied_post
      JOIN users on users.id = applied_post.user_id
        WHERE task_id = $1`,
      [id]
    );
    let applicants = result.rows;

    return res.json(applicants);
  } catch (err) {
    logger.error(err.toString());
    return res.status(401).json(err);
  }
});

//get accepted freelancer
taskRoutes.get("/task/accepted-applicant/:acceptedId", async (req, res) => {
  let acceptedUserId = parseInt(req.params.acceptedId);
  let result = await client.query(/* sql */`SELECT * FROM users WHERE id = $1`, [acceptedUserId]);
  let acceptedUser = result.rows;
  res.json(acceptedUser[0]);
})

//insert application data into database
taskRoutes.put("/apply/:taskId", async function (req, res) {
  const taskId = parseInt(req.params.taskId);
  const applyUserId = req.body.applied_user_id;

  //check if there is any duplicate application
  let checkResult = await client.query(/*sql*/`SELECT * FROM applied_post 
    WHERE user_id = $1 AND task_id = $2`, [applyUserId, taskId]);
  
  if (checkResult.rowCount === 0) {
    await client.query(
      /*sql*/ `INSERT INTO applied_post (user_id, task_id, applied_date) VALUES ($1, $2, NOW());`,
      [applyUserId, taskId]
    );
    res.status(200).json({ success: true });
  } else if (checkResult.rowCount === 1) {
    res.status(201).json({message: "You have already applied this task"})
  } else {
    res.status(400).json({message: "error"})
  }
});

//create task
taskRoutes.post(
  "/create-task/:userId",
  upload.single("image"),
  async (req, res) => {
    let user_id = parseInt(req.params.userId);
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
      return res.status(401).json(err.toString());
    }
  }
);

//task submission
taskRoutes.post(
  "/submit-completed-task/:taskId",
  taskSubmission.array("uploaded_files", 10),
  async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);

      console.log("uploaded");

      //insert files to SQL
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          const filename = req.files[i].filename;
          await client.query(
            /*sql*/ `INSERT INTO Task_submissions (task_id,filename) VALUES ($1,$2)`,
            [taskId, filename]
          );
        }
      }
      return res.status(201).json("Files are successfully uploaded");
    } catch (err) {
      logger.error(err.toString());
      return res.status(401).json(err.toString());
    }
  }
);

//choose particular applicant for the task & send message
taskRoutes.put('/task/accept', async (req, res) => {
  let userId = req.body.user_Id;
  let taskId = req.body.task_Id;
  let taskTitleRes = await client.query(/* sql */`SELECT title FROM task WHERE id = $1`, [taskId]);
  let taskTitle = taskTitleRes.rows[0];
  
  await client.query(/* sql */`UPDATE task SET accepted_user_id = $1, status = 'filled' 
  WHERE id = $2;`, [userId, taskId])

  await client.query(
    /* sql */ `INSERT INTO messages (recipient_id, content, created_at,updated_at) 
    VALUES ($1, 'You are hired for task - ${taskTitle.title}.
    Please contact task owner for more details',
      NOW(),
      NOW()
  );`, [userId])

  res.status(200).json({success:true})
})

//delete method for task page
taskRoutes.delete("/task/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if(isNaN(id)){
    res.status(400).json({"message":"id not a number!!!"});
    return;
  }
  await client.query(/* sql */`DELETE FROM applied_post WHERE task_id = $1`, [id]);
  await client.query(/* sql */`DELETE FROM task WHERE id = $1`, [id]);
  res.json({ success: true });
});

// update method for task page
taskRoutes.put('/task/:id', async (req,res)=>{
  const id = parseInt(req.params.id);
  if(isNaN(id)){
      res.status(400).json({"message":"id not a number!!!"});
      return;
  }
  await client.query(/* sql */`UPDATE task set content = $1 WHERE id = $2`,
          [req.body.editContent,id]);

  res.json({success:true});
})