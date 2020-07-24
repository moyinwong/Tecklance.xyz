import express from "express";
import { client } from "./main";
import { Message } from "./models";
import { logger } from "./logger";

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
        /*sql*/ `SELECT messages.id,sender_id,content,username from messages LEFT JOIN users ON messages.sender_id=users.id WHERE recipient_id=$1`,
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
    await client.query(/*sql*/`UPDATE messages SET status = 'read' WHERE id = $1`, [messageId]);
    console.log(messageId)
    res.status(200).json({success:true})
  } catch(err) {
    console.log(err);
  }
})

//check for unread messages
messageRoutes.get("/message/unread", async (req, res) => {
  try {
    const getUserId = async (req) => {
      if (req.session && req.session.userId) {
        return req.session.userId;
      }
    };

    let userId = await getUserId(req);
    let result = await client.query(/*sql*/ `SELECT * FROM messages 
    WHERE recipient_id = $1 AND status IS NULL`, [userId]);
    let messages = result.rows;

    if (messages) {
      return res.status(200).json(messages);
    } else {
      return res.status(201);
    }

  } catch(err) {
    logger.error(err.toString());
    return res.status(401).json(err)
  }
})