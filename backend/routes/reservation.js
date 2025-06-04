// backend/routes/reservation.js
const express = require('express');

module.exports = function (knex) {
  const router = express.Router();

    // POST /api/reservation
     router.post('/', async (req, res) => {
    try {
      const {
        reservationDate,
        reservationTime,
        totalPrice,
        reservationTypeId,
        clientId
      } = req.body;

        const [newReservationId] = await knex('reservation').insert({
            reservationDate: reservationDate,                // ej. "2025-06-15"
            reservationTime: reservationTime,                // ej. "14:00:00"
            paymentStatus: 0,            // o el valor que quieras por defecto
            totalPrice: totalPrice,                // si ya lo calculaste en front o tenías un campo
            addedReservationDate: knex.fn.now(),   // la fecha y hora de creación
            ReservationStatus: "pending",        // o tu flujo de estados
            ReservationStatusDate: knex.fn.now(),  // misma hora de creación
            adminResponseComment: null,            // por defecto nulo
            reservationTypeId: reservationTypeId,        // por ejemplo 1, 2, 3, etc.
            clientId: clientId                     // el userId que viene del login
        });


      // 3) Devolver al front-end algo de utilidad (ej. el id recién generado)
      return res
        .status(201)
        .json({ message: 'Reserva creada con éxito', reservationId: newReservationId });
    } catch (err) {
        console.error('Error POST /api/reservation:', err);
        return res.status(500).json({ error: 'No se pudo crear la reserva' });
    }
  });

    // GET /api/reservation/:userId
    router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;

      // Actualizamos esta consulta para unir la tabla reservation con reservationcosts y client:
      const rows = await knex('reservation')
        // Hacemos INNER JOIN con reservationcosts para traer el texto y el precio
        .join(
          'reservationcosts',
          'reservation.reservationTypeId',
          'reservationcosts.reservationTypeId'
        )
        // Hacemos INNER JOIN con client para traer el nombre de usuario (userName)
        .join('client', 'reservation.clientId', 'client.clientId')
        // Seleccionamos las columnas que queremos exponer
        .select(
          'reservation.reservationId',
          'reservationcosts.reservationType as reservationType', // p.ej. "Individual"
          'reservationcosts.pricePerDay as pricePerDay',          // p.ej. 1500.00
          'client.userName as userName',                         // p.ej. "César Morán"
          'reservation.reservationDate',
          'reservation.reservationTime',
          'reservation.totalPrice',
          'reservation.ReservationStatus',
          'reservation.addedReservationDate'  // si quieres mostrar fecha/hora de creación
        )
        .where('reservation.clientId', userId);

      return res.status(200).json(rows);
    } catch (err) {
      console.error('Error GET /api/reservation/:userId', err);
      return res.status(500).json({ error: 'Error al obtener reservaciones' });
    }
  });

    return router;
};
