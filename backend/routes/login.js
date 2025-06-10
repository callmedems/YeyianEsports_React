// backend/routes/login.js
const express = require('express');

module.exports = function (knex) {
  const router = express.Router();

  // POST /api/login
  router.post('/', async (req, res) => {
    try {
      const { mail, password } = req.body;

      // 1) Buscamos en la tabla client un usuario con ese mail
      const usuario = await knex('client').where({ mail }).first();

      if (!usuario) {
        // No existe ningún registro con ese correo
        
        return res
          .status(400)
          .json({ error: 'Email o contraseña incorrectos' });
      }

      // 2) Comparamos la contraseña en texto plano
      if (usuario.password !== password) {
        // Contraseña no coincide
        return res
          .status(400)
          .json({ error: 'Email o contraseña incorrectos' });
      }

      // 3) Si llegamos aquí, el mail y password coinciden
      return res.status(200).json({
        token: 'true',
        clientId: usuario.clientId,
        userName: usuario.userName,
        profilePicture : usuario.profilePicture,
      });
    } catch (err) {
      console.error('Error POST /api/login:', err);
      return res
        .status(500)
        .json({ error: 'Hubo un error al iniciar sesión' });
    }
  });

  return router;
};
