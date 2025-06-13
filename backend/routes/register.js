// backend/routes/register.js
const express = require('express');

module.exports = function (knex) {
  const router = express.Router();

  // POST /api/register
  router.post('/', async (req, res) => {
    try {
      const { mail, phoneNumber, userName, password, dateOfBirth, gender  } = req.body;

      // (Opcional) Puedes verificar si ya existe un usuario con ese correo:
      const existing = await knex('client').where({ mail }).first();
      if (existing) {
        return res
          .status(400)
          .json({ error: 'Ya existe una cuenta con ese correo.' });
      }

      // Insertamos el nuevo usuario en la tabla "client"
      const [clientId]=await knex('client').insert({
        mail,
        phoneNumber,
        userName,
        password, // Nota: en producción conviene hashear, pero aquí será texto plano
        dateOfBirth,         
        gender,
        profilePicture: null // o quítalo si no lo usas
      });

      const [session] = await knex('user_sessions').insert({ clientId });
      const sessionId = session; 


      // Respondemos con un status 201 (Created) y un mensaje
      return res
        .status(201)
        .json({
          token: 'true',
          clientId,
          userName,
          sessionId,  
          message: 'Cuenta registrada con éxito'
        });


       
    } catch (err) {
      console.error('Error POST /api/register:', err);
      return res
        .status(500)
        .json({ error: 'No se pudo registrar la cuenta' });
    }
  });

  return router;
};
