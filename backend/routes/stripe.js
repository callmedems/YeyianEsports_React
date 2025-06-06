// backend/routes/stripe.js

const express = require("express");
const router  = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
  try {
    // La cantidad en centavos la manda el front en `req.body.amount`
    const amountInCentavos = Math.round(req.body.amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   amountInCentavos,
      currency: "mxn",
    });

    // OJO: devolvemos EXCLUSIVAMENTE el client_secret, no el id
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.error("Error al crear PaymentIntent:", err);
    return res.status(500).json({
      error: "No se pudo iniciar el pago. Intenta de nuevo más tarde."
    });
  }
});

module.exports = router;
