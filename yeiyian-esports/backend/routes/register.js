// backend/routes/reviews.js
const express = require('express');

module.exports = function (knex) {
  const router = express.Router();

  // POST /api/register
  router.post('/', async (req, res) => {
    try {
      const { mail, phoneNumber, userName,password } = req.body;

      await knex('client').insert({
        mail,
        phoneNumber,
        userName,
        password // usa el mismo nombre que la tabla
      });

      res.status(201).json({ message: 'Cuenta registrada con éxito' });
    } catch (err) {
      console.error('Error POST /register:', err);
      res.status(500).json({ error: 'No se pudo registrar la cuenta' });
    }
  });

  return router;
};
