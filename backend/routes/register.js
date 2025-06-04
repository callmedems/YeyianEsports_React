// backend/routes/register.js
const express = require('express');

module.exports = function (knex) {
  const router = express.Router();

  // POST /api/register
  router.post('/', async (req, res) => {
    try {
      const { mail, phoneNumber, userName, password } = req.body;

      // (Opcional) Puedes verificar si ya existe un usuario con ese correo:
      const existing = await knex('client').where({ mail }).first();
      if (existing) {
        return res
          .status(400)
          .json({ error: 'Ya existe una cuenta con ese correo.' });
      }

      // Insertamos el nuevo usuario en la tabla "client"
      await knex('client').insert({
        mail,
        phoneNumber,
        userName,
        password, // Nota: en producción conviene hashear, pero aquí será texto plano
        profilePicture: null // o quítalo si no lo usas
      });

      // Respondemos con un status 201 (Created) y un mensaje
      return res
        .status(201)
        .json({ message: 'Cuenta registrada con éxito' });
    } catch (err) {
      console.error('Error POST /api/register:', err);
      return res
        .status(500)
        .json({ error: 'No se pudo registrar la cuenta' });
    }
  });

  return router;
};
