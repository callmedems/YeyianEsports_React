const express = require('express');
const bcrypt = require('bcrypt'); // <--- Agregamos bcrypt

module.exports = function (knex) {
  const router = express.Router();

  // POST /api/register
  router.post('/', async (req, res) => {
    try {
      const { mail, phoneNumber, userName, password, dateOfBirth, gender } = req.body;

      const existing = await knex('client').where({ mail }).first();
      if (existing) {
        return res.status(400).json({ error: 'Ya existe una cuenta con ese correo.' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);  // <--- Hasheamos aquí

      const [clientId] = await knex('client').insert({
        mail,
        phoneNumber,
        userName,
        password: hashedPassword,  // <--- Guardamos el hash
        dateOfBirth,
        gender,
        profilePicture: null
      });

      const [session] = await knex('user_sessions').insert({ clientId });
      const sessionId = session;

      return res.status(201).json({
        token: 'true',
        clientId,
        userName,
        sessionId,
        message: 'Cuenta registrada con éxito'
      });

    } catch (err) {
      console.error('Error POST /api/register:', err);
      return res.status(500).json({ error: 'No se pudo registrar la cuenta' });
    }
  });

  return router;
};
