const express = require('express');
module.exports = function (knex) {
  const router = express.Router();

  // GET: Reservas filtradas por estado
  router.get('/', async (req, res) => {
    const filter = req.query.filter;  // you pass the state that is activated through the front end buttons
    console.log('Filtro recibido:', filter); 
    try {
      let query = knex('reservation_view');

      if (filter) {
        query = query.where('status_group', filter);

        // Aquí aplicamos el orden dependiendo el filtro:
        if (filter === 'cancelled' || filter === 'past') {
          query = query.orderBy('fullDate', 'desc');
        } else if (filter === 'active' || filter === 'future') {
          query = query.orderBy('fullDate', 'asc');
        }
      } 

      const results = await query;
      res.json(results);
    } catch (err) {
      console.error('Error al obtener las reservas:', err);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
  });

  router.put('/cancel/:id', async (req, res) => {
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
});


  return router;
}
