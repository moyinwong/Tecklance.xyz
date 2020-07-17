import express from "express";

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
    console.log(data);
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode).send(err.decline_code);
  }
  return res.send("Payment was successful");
});
