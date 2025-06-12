const express = require('express');
module.exports = function (knex) {
  const router = express.Router();

  // GET
   router.get('/', async (req, res) => {
    try {
      const eventTypesInfo = await knex('reservationcosts')

      const formatted = eventTypesInfo.map(e => ({
        reservationTypeId: e.reservationTypeId,
        reservationType: e.reservationType,
        pricePerDay:e.pricePerDay,
      }));

      res.json(formatted); 
    } catch (err) {
      console.error(' Error GET /config-event-type:', err);
      res.status(500).json({ error: 'No se pudieron obtener la información de los eventos' });
    }
  });

   router.put('/:id', async (req, res) => {
    const reservationTypeId = req.params.id;
    const { pricePerDay } = req.body;

    try {
      await knex('reservationcosts')
        .where('reservationTypeId', reservationTypeId)
        .update({ pricePerDay });

      res.json({ message: 'Precio actualizado correctamente.' });
    } catch (err) {
      console.error('Error al actualizar precio:', err);
      res.status(500).json({ error: 'Error al actualizar el precio' });
    }
  });



  return router;
};
