// backend/routes/reviews.js
const express = require('express');

module.exports = function (knex) {
  const router = express.Router();

  // GET /api/reviews
    router.get('/', async (req, res) => {
      try {
        const reviews = await knex('review')
          .join('client', 'review.clientId', '=', 'client.clientId')
          .select(
            'client.userName as userName',
            'client.profilePicture as profilePicture',
            'review.commentAdded as commentAdded',
            'review.givenStars as givenStars',
            'review.additionDate as additionDate'
          );

        const formatted = reviews.map(r => ({
          name: r.userName,
          profilePicture:r.profilePicture,
          commentAdded: r.commentAdded,
          givenStars: r.givenStars,
          timeAgo: new Date(r.additionDate).toLocaleDateString()
        }));

        res.json(formatted); //Bien
      } catch (err) {
        console.error(' Error GET /reviews:', err);
        res.status(500).json({ error: 'No se pudieron obtener reviews' });
      }
    });

  // POST /api/reviews
  router.post('/', async (req, res) => {
    try {
      const { commentAdded, givenStars, clientId } = req.body;

      // Validación básica
      if (!commentAdded || !givenStars || !clientId) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      await knex('review').insert({
        commentAdded,
        givenStars,
        clientId,
        additionDate: new Date() // usa el mismo nombre que la tabla
      });

      res.status(201).json({ message: 'Reseña guardada con éxito' });
    } catch (err) {
      console.error('Error POST /reviews:', err);
      res.status(500).json({ error: 'No se pudo guardar la reseña' });
    }
  });

  return router;
};
