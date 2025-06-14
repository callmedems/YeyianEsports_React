const express = require('express');
const bcrypt = require('bcrypt');  // <--- Agregamos bcrypt

module.exports = function (knex) {
  const router = express.Router();

  // POST /api/login
  router.post('/', async (req, res) => {
    try {
      const { mail, password } = req.body;

      // Primero intentamos buscar en admin
      const admin = await knex('admin').where({ mail }).first();
      if (admin) {
        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
          return res.status(200).json({
            token: 'true',
            fullPermits: true,
            adminId: admin.adminId,
            userName: admin.username,
            profilePicture: admin.profilePicture,
            sessionId: null,
            isAdmin: true
          });
        }
      }

      // Si no es admin, buscamos en client
      const usuario = await knex('client').where({ mail }).first();
      if (!usuario) {
        return res.status(400).json({ error: 'Email o contraseña incorrectos' });
      }

      const isMatch = await bcrypt.compare(password, usuario.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Email o contraseña incorrectos' });
      }

      const [session] = await knex('user_sessions').insert({ clientId: usuario.clientId });

      return res.status(200).json({
        token: 'true',
        fullPermits: false,
        clientId: usuario.clientId,
        userName: usuario.userName,
        profilePicture: usuario.profilePicture,
        sessionId: session,
        isAdmin: false
      });

    } catch (err) {
      console.error('Error POST /api/login:', err);
      return res.status(500).json({ error: 'Hubo un error al iniciar sesión' });
    }
  });

  return router;
};
