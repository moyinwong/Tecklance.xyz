import express from "express";
import { logger } from "./logger";
import { client } from "./main";

export const paymentRoutes = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET);

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

    const getCurrentUserId = async (req) => {
      if (req.session) {
        return req.session.userId;
      }
    };

    const userId = await getCurrentUserId(req);

    logger.debug(userId);

    await client.query(
      /*sql*/ `UPDATE users SET remain_amt = $1 WHERE id = $2`,
      [req.body.chargeAmount, userId]
    );
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode).send(err.decline_code);
  }

  return res.send("Payment was successful");
});
