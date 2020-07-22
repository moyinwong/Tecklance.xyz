import express from "express";
import { client } from "./main";
import { Message } from "./models";

export const messageRoutes = express.Router();

//getting all message from active user
messageRoutes.get("/getMessage", async (req, res) => {
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

  res.status(200).json(messages);
});
