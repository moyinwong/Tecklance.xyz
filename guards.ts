import express from "express";
import { logger } from "./logger";

//if logged in, can access protected folder
export const isLoggedIn = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log(req.session);
  if (req.session && req.session.userId) {
    //called Next here
    //console.log(req.session);
    logger.info(`User ${req.session.userId} is logged in`);
    next();
  } else {
    // redirect to index page
    console.log("not logged in");
    res.status(401).redirect("/");
  }
};

//make a guard to restrict del and put
export const isLoggedInAPI = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ success: false });
  }
};
