// backend/routes/register.js
const express = require('express');

module.exports = function (knex) {
  const router = express.Router();

  // POST /api/register
  router.post('/', async (req, res) => {
    try {
      const { mail, phoneNumber, userName, password, dateOfBirth, gender } = req.body;
      const existing = await knex('client').where({ mail }).first();
      if (existing) {
        return res
          .status(400)
          .json({ error: 'Ya existe una cuenta con ese correo.' });
      }


      const [clientId] = await knex('client').insert({
        mail,
        phoneNumber,
        userName,
        password,            
        dateOfBirth,         
        gender,              
        profilePicture: null 
      });

  
      const [session] = await knex('user_sessions').insert({ clientId });
      const sessionId = session; 

      const isAdmin = (clientId === 1);


      return res
        .status(201)
        .json({
          token: 'true',
          clientId,
          userName,
          sessionId,    // 🆕
          isAdmin,      // 🆕
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
