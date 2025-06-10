const express = require('express');

module.exports = function (knex) {
  const router = express.Router();
    router.get('/', async (req, res) => {
    try {
        
        const dates = await knex('reservation').pluck('reservationDate');
        console.log('Fechas ocupadas:', dates); 
        return res.json(dates);
    } catch (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
    });
    return router;
};