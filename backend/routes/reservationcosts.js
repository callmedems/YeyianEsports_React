// backend/pricing.js

const express = require("express");
const router  = express.Router();

module.exports = function (knex) {
  // Devuelve all tipos y precios
  router.get("/", async (req, res) => {
    try {
      const rows = await knex("reservationcosts")
        .select("reservationTypeId", "reservationType", "pricePerDay");
      return res.json(rows);
    } catch (err) {
      console.error("Error GET /api/reservationcosts:", err);
      return res.status(500).json({ error: "No se pudieron obtener los precios." });
    }
  });

  return router;
};
