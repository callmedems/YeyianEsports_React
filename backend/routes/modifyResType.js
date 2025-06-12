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

  /*router.update('/:id', async (req, res) => {
    const reservationId = req.params.id;

    try {
        await knex('reservation')
            .where('reservationId', reservationId)
            .update({ reservationStatus: 'rejected' });

        res.json({ message: 'Reserva cancelada correctamente.' });
    } catch (err) {
        console.error('Error al cancelar reserva:', err);
        res.status(500).json({ error: 'Error al cancelar la reserva' });
    }
        });*/



  return router;
};
