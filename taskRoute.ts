import express from "express";
import { Task } from "./models";
import { client } from "./main";


export const taskRoutes = express.Router();

taskRoutes.get('/cms',async function(req,res){

    const result = await client.query(`SELECT * FROM task`);
    const memos:Task[]  = result.rows;
    res.json(memos);
});

