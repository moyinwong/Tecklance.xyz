import express from "express";
import { logger } from "./logger";
import { client } from "./main";

//if logged in, can access protected folder
export const isLoggedIn = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  logger.debug(req.session);
  if (req.session && req.session.userId) {
    //called Next here
    //console.log(req.session);
    logger.info(`User ${req.session.userId} is logged in`);
    next();
  } else {
    // redirect to index page
    //console.log("not logged in");
    res.status(401).redirect("/");
  }
};

//make a guard to restrict del and put
export const isLoggedInAPI = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json("Please login.");
  }
};

//make a guard to restrict del and put
export const isAdminAPI = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session && req.session.userId) {
    const adminIds = (
      await client.query(
        /*sql*/ `SELECT * FROM users WHERE isadmin=TRUE AND id=$1`,
        [req.session.userId]
      )
    ).rows;
    const adminId = adminIds[0];
    if (adminId) {
      next();
    } else {
      res.status(401).json({msg:"You are not an Admin."});
    }
  } else {
    res.status(401).json({msg:"Please login."});
  }
};
