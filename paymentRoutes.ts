import express from "express";
import { logger } from "./logger";
import { client } from "./main";

export const paymentRoutes = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const getCurrentUserId = async (req) => {
  if (req.session) {
    return req.session.userId;
  }
};

export const charge = (token: string, amount: number) => {
  return stripe.charges.create(
    {
      amount: amount,
      currency: "hkd",
      source: token,
    },
    function (err: any, charge: any) {
      if (err && err.type === "StripeCardError") {
        console.log("card is declined");
      }
    }
  );
};

paymentRoutes.post("/charge", async (req, res) => {
  try {
    const data: any = await stripe.charges.create({
      source: req.body.stripeToken,
      amount: req.body.chargeAmount * 100,
      currency: "hkd",
    });
    logger.debug(data);

    const userId = await getCurrentUserId(req);

    const user = (
      await client.query(/*sql*/ `SELECT * FROM users SET WHERE id = $1`, [
        userId,
      ])
    ).rows[0];

    const { remain_amt } = user;

    await client.query(
      /*sql*/ `UPDATE users SET remain_amt = $1 WHERE id = $2`,
      [parseInt(req.body.chargeAmount) + parseInt(remain_amt), userId]
    );
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode).send(err.decline_code);
  }

  return res.send("Payment was successful");
});

paymentRoutes.get("/getRemainAmt", async (req, res) => {
  try {
    const userId = await getCurrentUserId(req);

    const users = (
      await client.query(/*sql*/ `SELECT * FROM users WHERE id = $1`, [userId])
    ).rows;

    const remainAmt = users[0].remain_amt;

    return res.status(200).json(remainAmt);
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode).send(err.decline_code);
  }
});
