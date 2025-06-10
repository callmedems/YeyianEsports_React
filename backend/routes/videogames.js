const express = require('express');

module.exports = function (knex) {
  const router = express.Router();

  // GET /api/videogames
  router.get('/', async (req, res) => {
    try {
      const games = await knex('game')
        .select(
          'game.gameName',
          'game.thumbnailImage',
          'game.releaseDate',
          'game.genre',
          'game.lore',
        );

      const formatted = games.map(g => ({
        gameName:g.gameName,
        thumbnailImage:g.thumbnailImage,
        releaseDate:g.releaseDate,
        genre:g.genre,
        lore:g.lore,
      }));

      res.json(formatted); //Bien
    } catch (err) {
      console.error(' Error GET /videogames:', err);
      res.status(500).json({ error: 'No se pudieron obtener los videojuegos' });
    }
  });

  return router;
};
