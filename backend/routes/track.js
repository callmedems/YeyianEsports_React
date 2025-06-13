// backend/routes/track.js
const express = require('express')

module.exports = function (knex) {
  const router = express.Router()

  router.post('/page-view', async (req, res) => {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const sessionId = parseInt(body.sessionId, 10)
    if (!sessionId) return res.status(400).send('sessionId required')
    const page = body.page
    try {
      await knex('page_views').insert({ sessionId, page })
      res.sendStatus(204)
    } catch (err) {
      console.error(err)
      res.sendStatus(500)
    }
  })

  router.post('/game-click', async (req, res) => {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const sessionId = parseInt(body.sessionId, 10)
    const gameId = parseInt(body.gameId, 10)
    if (!sessionId || !gameId) return res.status(400).send('invalid parameters')
    try {
      await knex('game_clicks').insert({ sessionId, gameId, clickTime: knex.fn.now() })
      res.sendStatus(204)
    } catch (err) {
      console.error(err)
      res.sendStatus(500)
    }
  })

  router.post('/session-end', async (req, res) => {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const sessionId = parseInt(body.sessionId, 10)
    if (!sessionId) return res.status(400).send('sessionId required')
    try {
      await knex('user_sessions').where({ sessionId }).update({ endTime: knex.fn.now() })
      res.sendStatus(204)
    } catch (err) {
      console.error(err)
      res.sendStatus(500)
    }
  })

  return router
}
