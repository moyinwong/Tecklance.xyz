import express from "express";
import { client } from "./main";
import { Message } from "./models";
import { logger } from "./logger";
import { isLoggedInAPI } from "./guards";

export const messageRoutes = express.Router();

//getting all message from active user
messageRoutes.get("/getMessage", async (req, res) => {
  try {
    const getUserId = async (req) => {
      if (req.session && req.session.userId) {
        return req.session.userId;
      }
    };

    const userId = await getUserId(req);

    const messages: Message[] = (
      await client.query(
        /*sql*/ `SELECT messages.id,sender_id,content,username,messages.created_at,messages.status from messages LEFT JOIN users ON messages.sender_id=users.id WHERE recipient_id=$1 ORDER BY id DESC`,
        [userId]
      )
    ).rows;

    return res.status(200).json(messages);
  } catch (err) {
    logger.error(err.toString());
    return res.status(401).json(err);
  }
});

//insert read status into database
messageRoutes.put("/message/read", async (req, res) => {
  try {
    let messageId = req.body.message_id;
    await client.query(
      /*sql*/ `UPDATE messages SET status = 'read' WHERE id = $1`,
      [messageId]
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

//check for unread messages
messageRoutes.get("/message/unread", async (req, res) => {
  try {
    const getUserId = async (req) => {
      if (req.session && req.session.userId) {
        return req.session.userId;
      }
    };

    let userId = await getUserId(req);
    let result = await client.query(
      /*sql*/ `SELECT * FROM messages 
    WHERE recipient_id = $1 AND status IS NULL`,
      [userId]
    );
    let messages = result.rows;

    if (messages) {
      return res.status(200).json(messages);
    } else {
      return res.status(201);
    }
  } catch (err) {
    logger.error(err.toString());
    return res.status(401).json(err);
  }
});

//reject
messageRoutes.post("/rejectFiles", isLoggedInAPI, async (req, res) => {
  try {
    const getTaskId = async (req) => {
      if (req.header && req.headers.referer) {
        return req.headers.referer.replace(
          "http://localhost:8080/task.html?id=",
          ""
        );
      }
    };
    const taskId: string = await getTaskId(req);

    //get accepted user id by req.session
    const getAcceptUserId = async (taskId) => {
      const accepted_user_id = (
        await client.query(
          /*sql*/ `SELECT accepted_user_id FROM task WHERE id = $1`,
          [taskId]
        )
      ).rows[0].accepted_user_id;
      return accepted_user_id;
    };

    const accepted_user_id: number = await getAcceptUserId(taskId);

    const content = `The upload files do not meet the requirement. Please upload again after finished.
    Please check the following link: *url*${req.headers.referer}`;

    await client.query(
      /*sql*/ `INSERT INTO messages (recipient_id, content, created_at) VALUES ($1,$2,NOW())`,
      [accepted_user_id, content]
    );

    return res.status(201).json("The reject message is sent to freelancer.");
  } catch (err) {
    logger.error(err.toString());
    return res.status(401).json(err);
  }
});

// accept
messageRoutes.post("/acceptFiles", isLoggedInAPI, async (req, res) => {
  try {
    const getTaskId = async (req) => {
      if (req.header && req.headers.referer) {
        return req.headers.referer.replace(
          "http://localhost:8080/task.html?id=",
          ""
        );
      }
    };
    const taskId: string = await getTaskId(req);

    //get accepted user id by req.session
    const getAcceptUserId = async (taskId) => {
      const accepted_user_id = (
        await client.query(
          /*sql*/ `SELECT accepted_user_id FROM task WHERE id = $1`,
          [taskId]
        )
      ).rows[0].accepted_user_id;
      return accepted_user_id;
    };

    const accepted_user_id: number = await getAcceptUserId(taskId);

    const content = `The upload fulfilled the requirement! The task has been completed! You will receive the reward within few days
    Please check the following link: *url*${req.headers.referer}`;

    await client.query(
      /*sql*/ `INSERT INTO messages (recipient_id, content, created_at) VALUES ($1,$2,NOW())`,
      [accepted_user_id, content]
    );

    await client.query(
      /*sql*/ `UPDATE task SET status = 'completed' WHERE id = $1`,
      [taskId]
    );

    return res.status(201).json("The accept message is sent to freelancer.");
  } catch (err) {
    logger.error(err.toString());
    return res.status(401).json(err);
  }
});
