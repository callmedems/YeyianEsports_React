// routes/login.js
const express = require('express');

module.exports = function (knex) {
  const router = express.Router();

  // POST /api/login
  router.post('/', async (req, res) => {
    const { mail, password } = req.body;

    try {
      const user = await knex('client')
        .where({ mail, password }) 
        .first();

      if (!user) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
      }

      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        user: {
          id: user.id,
          mail: user.mail,
          userName: user.userName
        }
      });
    } catch (err) {
      console.error('Error POST /login:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });

  return router;
};
