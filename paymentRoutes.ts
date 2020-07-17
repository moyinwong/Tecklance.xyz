import express from "express";

export const paymentRoutes = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const charge = (token: string, amount: number) => {
  return stripe.charges.create({
    amount: amount,
    currency: "hkd",
    source: token,
  });
};

paymentRoutes.post("/charge", async (req, res) => {
  console.log(req.body);
  let data = await charge(req.body.stripeToken, req.body.chargeAmount);
  console.log(data);
});
