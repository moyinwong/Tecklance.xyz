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
        /*sql*/ `SELECT sender_id,content,username from messages LEFT JOIN users ON messages.sender_id=users.id WHERE recipient_id=$1`,
        [userId]
      )
    ).rows;

    return res.status(200).json(messages);
  } catch (err) {
    logger.error(err.toString());
    return res.status(401).json(err);
  }
});
