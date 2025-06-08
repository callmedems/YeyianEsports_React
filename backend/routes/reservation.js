// backend/routes/reservation.js
const express = require('express');
const nodemailer = require('nodemailer');

module.exports = function (knex) {
  const router = express.Router();

  // 1) Configuración del transporter de Nodemailer:
  // Usamos las variables definidas en .env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true si usas 465, false para 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error('⚠️ Error al verificar transporter de Nodemailer:', error);
    } else {
      console.log('✅ Servidor SMTP listo para enviar correos');
    }
  });

  // POST /api/reservation → crea la reserva y envía correo de confirmación
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

        // 2. Recuperar correo y nombre del cliente
        const clienteRows = await knex('client')
          .select('mail', 'userName')
          .where('clientId', clientId)
          .limit(1);

        if (clienteRows.length === 0) {
          // Rara situación: se creó reserva, pero no existe ese clientId
          return res.status(404).json({
            error: 'Cliente no encontrado (no se pudo enviar correo).',
            reservationId: newReservationId
          });
        }

        const { mail: clientEmail, userName } = clienteRows[0];

        // 3. Recuperar información del tipo de reserva (texto y precio)
        const tipoRows = await knex('reservationcosts')
          .select('reservationType as reservationTypeText', 'pricePerDay')
          .where('reservationTypeId', reservationTypeId)
          .limit(1);

        let tipoReservaTexto = '';
        let precioPorDia = '';
        if (tipoRows.length > 0) {
          tipoReservaTexto = tipoRows[0].reservationTypeText;
          precioPorDia = tipoRows[0].pricePerDay;
        }

        // 4. Construir asunto y cuerpo del correo (texto y HTML)
        const mailSubject = 'Confirmación de pago en Yeyian Arena';

        // Texto plano
        const mailHtml = `
<h2>Confirmación de pago en <span style="color:#007bff">Yeyian Arena</span></h2>
<p>Hola <strong>${userName}</strong>,</p>
<p>Tu reserva ha sido <strong>registrada</strong> con éxito. Aquí tienes los detalles:</p>
<ul>
  <li><strong>ID de reserva:</strong> ${newReservationId}</li>
  <li><strong>Fecha:</strong> ${reservationDate}</li>
  <li><strong>Hora:</strong> ${reservationTime}</li>
  <li><strong>Tipo de reserva:</strong> ${tipoReservaTexto}</li>
  <li><strong>Precio total:</strong> $${totalPrice}</li>
</ul>
<p>Te recordamos que el estado de la reserva está: <strong>Pendiente</strong></p>
<p>Durante las siguientes horas te estaremos confirmando tu reservación.</p>
<p>Gracias por preferirnos. Si necesitas modificar o cancelar tu reserva, accede a tu cuenta y entra a “Mis Reservas”.</p>
<br>
<p>Saludos cordiales,<br>El equipo de <strong>Yeyian Arena</strong></p>
        `;

        // 5. Configurar opciones de envío
        const mailOptions = {
          from: process.env.EMAIL_FROM, // '"Yeyian Arena" <no-reply@yeyianarena.com>'
          to: clientEmail,
          subject: mailSubject,
          text: mailHtml,
          html: mailHtml
        };

        // 6. Enviar el correo
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('⚠️  Error al enviar correo de confirmación:', error);
            // Aunque falle el correo, la reserva ya está creada. Devolvemos 201 con advertencia.
            return res.status(201).json({
              warning: 'Reserva creada, pero no se pudo enviar el correo de confirmación.',
              reservationId: newReservationId
            });
          } else {
            console.log('✅ Correo de confirmación enviado:', info.messageId);
            return res.status(201).json({
              success: true,
              message: 'Reserva creada y correo de confirmación enviado.',
              reservationId: newReservationId
            });
          }
        });

      // 7) Devolver al front-end algo de utilidad (ej. el id recién generado)
      return res
        .status(201)
        .json({ message: 'Reserva creada en estado pendiente', reservationId: newReservationId });
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
