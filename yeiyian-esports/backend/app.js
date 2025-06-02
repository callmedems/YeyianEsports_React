const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/occupied-dates', async (req, res) => {
  try {
    const dates = await db('Reservation').pluck('reservationDate');
    return res.json(dates);
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const { nombre, correo, tipoReserva, fecha, hora, token } = req.body;

    if (!tipoReserva || !fecha || !hora) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    let clientId;

    if (token) {
      const user = await db('Client').where({ token }).first();
      if (user) {
        clientId = user.clientId;
      } else {
        return res.status(401).json({ error: 'Token inválido o expirado' });
      }
    }

    if (!clientId) {
      if (!nombre || !correo) {
        return res.status(400).json({ error: 'Faltan datos de cliente' });
      }
      const [newClientId] = await db('Client').insert({ mail: correo, userName: nombre });
      clientId = newClientId;
    }

    const rowTipo = await db('ReservationCosts').where({ reservationType: tipoReserva }).first();
    if (!rowTipo) {
      return res.status(400).json({ error: 'Tipo de reserva inválido' });
    }
    const reservationTypeId = rowTipo.reservationTypeId;
    const totalPrice = rowTipo.pricePerDay;

    const [reservationId] = await db('Reservation').insert({
      reservationDate: fecha,
      paymentStatus: false,
      totalPrice: totalPrice,
      addedReservationDate: new Date(),
      ReservationStatusDate: new Date(),
      adminResponseComment: null,
      reservationTypeId,
      clientId
    });

    return res.status(201).json({
      message: 'Reservación creada exitosamente',
      data: {
        reservationId,
        clientId,
        reservationTypeId,
        totalPrice
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));

