// backend/routes/adminStats.js
const express = require('express')
module.exports = function (knex) {
  const router = express.Router()
  router.get('/stats', async (req, res) => {
    try {
      const [{ totalUsers }] = await knex('client').count('clientId as totalUsers')
      const [{ avgSessionDuration }] = await knex('user_sessions')
        .select(knex.raw('AVG(TIMESTAMPDIFF(MINUTE, startTime, endTime)) AS avgSessionDuration'))
      const byGender = await knex('client')
        .select('gender')
        .count('clientId as count')
        .groupBy('gender')
      const byAgeRange = await knex.raw(`
        SELECT
          CASE
            WHEN TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) BETWEEN 10 AND 19 THEN '10-19 años'
            WHEN TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) BETWEEN 20 AND 29 THEN '20-29 años'
            WHEN TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) BETWEEN 30 AND 39 THEN '30-39 años'
            ELSE '40+ años'
          END AS ageRange,
          COUNT(clientId) AS count
        FROM client
        WHERE dateOfBirth IS NOT NULL
        GROUP BY ageRange
      `).then(r => r[0])
      const sessions = await knex('user_sessions as us')
        .join('client as c', 'us.clientId', 'c.clientId')
        .select(
          'us.sessionId',
          'c.userName',
          'us.startTime',
          knex.raw('TIMESTAMPDIFF(MINUTE, us.startTime, us.endTime) as durationMin')
        )
        .orderBy('us.startTime', 'desc')
        .limit(5)
      res.json({
        totalUsers: parseInt(totalUsers, 10),
        avgSessionDuration: parseFloat(avgSessionDuration) || 0,
        byGender,
        byAgeRange,
        sessions
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  })
  return router
}
