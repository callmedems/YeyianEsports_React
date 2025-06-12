const express = require('express')

module.exports = function (knex) {
  const router = express.Router()

  router.post('/', async (req, res) => {
    try {
      const { mail, password } = req.body

      const admin = await knex('admin').where({ mail }).first()
      if (admin && admin.password === password) {
        return res.status(200).json({
          token: 'true',
          fullPermits: 'true',
          adminId: admin.adminId,
          userName: admin.username,
          profilePicture: admin.profilePicture,
          sessionId: null,
          isAdmin: true
        })
      }

      const usuario = await knex('client').where({ mail }).first()
      if (!usuario || usuario.password !== password) {
        return res.status(400).json({ error: 'Email o contraseña incorrectos' })
      }

      const [session] = await knex('user_sessions').insert({ clientId: usuario.clientId })
      return res.status(200).json({
        token: 'true',
        fullPermits: 'false',
        clientId: usuario.clientId,
        userName: usuario.userName,
        profilePicture: usuario.profilePicture,
        sessionId: session,
        isAdmin: false
      })
    } catch (err) {
      return res.status(500).json({ error: 'Hubo un error al iniciar sesión' })
    }
  })

  return router
}
