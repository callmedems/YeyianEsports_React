// backend/routes/reservation.js
const express = require('express');
const nodemailer = require('nodemailer');

module.exports = function (knex) {
  const router = express.Router();

  //------------------------------------------------------
  // 0) Crear y verificar transportador SMTP DE FORMA GLOBAL
  //    Asegurarse de que las variables de entorno estén definidas:
  //    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
  //------------------------------------------------------
  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Verificar UNA VEZ al cargar el módulo
  transporter.verify((error, success) => {
    if (error) {
      console.error('⚠️ Error al verificar transporter de Nodemailer:', error);
    } else {
      // Solo impresión inicial; no afecta al flujo real
      console.log('✅ Servidor SMTP listo para enviar correos');
    }
  });

  //------------------------------------------------------
  // 1) Ruta para crear una reserva pendiente (paymentStatus = 0)
  //    POST /api/reservation
  //------------------------------------------------------
 

  router.post('/', async (req, res) => {
    try {
      // 1.1) Extraer del body lo que espera la base de datos:
      const {
        reservationDate,
        reservationTime,
        totalPrice,
        reservationTypeId,
        clientId
      } = req.body;

      // 1.2) Asegurarse de que ninguno esté undefined o null:
      if (
        !reservationDate || 
        !reservationTime || 
        totalPrice === undefined || 
        reservationTypeId === undefined || 
        clientId === undefined
      ) { // Malformaste el JSON o falta algún campo esencial
        return res
          .status(400)
          .json({ error: 'Faltan campos obligatorios para crear la reserva.' });
      }

      // 1.3) Insertar en la tabla "reservation"
      const [newReservationId] = await knex('reservation').insert({
          reservationDate:        reservationDate,
          reservationTime:        reservationTime,
          paymentStatus:          0,
          totalPrice:             totalPrice,
          addedReservationDate:   knex.fn.now(),
          ReservationStatus:      "pending",
          ReservationStatusDate:  knex.fn.now(),
          adminResponseComment:   null,
          reservationTypeId:      reservationTypeId,
          clientId:               clientId
      });

      // 1.4) Responder al cliente con el ID de la reserva recién creada
      return res.status(201).json({
        message:       'Reserva creada en estado pendiente',
        reservationId: newReservationId
      });
    } catch (err) {
      console.error('Error POST /api/reservation:', err);
      return res.status(500).json({ error: 'No se pudo crear la reserva' });
    }
  });

  //------------------------------------------------------
  // 2) Ruta para confirmar pago y enviar el correo de confirmación
  //    POST /api/reservation/:reservationId/confirm-payment
  //------------------------------------------------------
  router.post('/:reservationId/confirm-payment', async (req, res) => {
    try {
      const { reservationId } = req.params;
      // (Opcional) Podrías recibir transactionId en req.body:
      // const { transactionId } = req.body;

      // 2.1) Consultar la reserva en BD
      const reservaRows = await knex('reservation')
        .select('*')
        .where('reservation.reservationId', reservationId)  // Buscar por ID, no por clientId
        .limit(1);

      if (reservaRows.length === 0) {
        return res.status(404).json({ error: 'Reserva no encontrada.' });
      }
      const reserva = reservaRows[0];

      // 2.2) Verificar que no se haya marcado ya como pagada
      if (reserva.paymentStatus === 1) {
        return res.status(400).json({ error: 'El pago ya fue confirmado previamente.' });
      }

      // 2.3) Actualizar la reserva: paymentStatus = 1 y ReservationStatus = 'pending'
      await knex('reservation')
        .where('reservationId', reservationId)
        .update({
          paymentStatus:          1,
          ReservationStatus:      'pending',
          ReservationStatusDate:  knex.fn.now()
        });

      // 2.4) Recuperar datos del cliente (correo y nombre) para el e-mail
      const clienteRows = await knex('client')
        .select('mail', 'userName')
        .where('clientId', reserva.clientId)
        .limit(1);

      if (clienteRows.length === 0) {
        return res.status(404).json({
          error: 'Cliente no encontrado (no se pudo enviar correo).'
        });
      }
      const { mail: clientEmail, userName } = clienteRows[0];

      // 2.5) Recuperar info del tipo de reserva (texto y precio por día)
      const tipoRows = await knex('reservationcosts')
        .select('reservationType as reservationTypeText', 'pricePerDay')
        .where('reservationTypeId', reserva.reservationTypeId)
        .limit(1);

      let tipoReservaTexto = '';
      let precioPorDia      = '';
      if (tipoRows.length > 0) {
        tipoReservaTexto = tipoRows[0].reservationTypeText;
        precioPorDia     = tipoRows[0].pricePerDay;
      }

      // 2.6) Construir asunto y cuerpo del correo (texto plano y HTML)
      const mailSubject = 'Confirmación de pago y reserva en Yeyian Arena';

      const mailText = `
Hola ${userName},

¡Tu pago ha sido procesado correctamente y tu reserva ha sido confirmada! Aquí están los detalles:

- ID de reserva: ${reserva.reservationId}
- Fecha: ${reserva.reservationDate.toISOString().slice(0, 10)}
- Hora: ${reserva.reservationTime}
- Tipo de reserva: ${tipoReservaTexto}
- Precio total: $${reserva.totalPrice}

El estado de tu reserva ahora es: “Confirmada”.

Gracias por preferirnos. Si necesitas modificar o cancelar tu reserva, ingresa a tu cuenta y ve a “Mis Reservas”.

Saludos cordiales,
El equipo de Yeyian Arena
      `;

      const mailHtml = `
<h2>Confirmación de pago y reserva en <span style="color:#007bff">Yeyian Arena</span></h2>
<p>Hola <strong>${userName}</strong>,</p>
<p>¡Tu pago ha sido <strong>procesado correctamente</strong> y tu reserva ha sido confirmada! Aquí están los detalles:</p>
<ul>
  <li><strong>ID de reserva:</strong> ${reserva.reservationId}</li>
  <li><strong>Fecha:</strong> ${reserva.reservationDate.toISOString().slice(0, 10)}</li>
  <li><strong>Hora:</strong> ${reserva.reservationTime}</li>
  <li><strong>Tipo de reserva:</strong> ${tipoReservaTexto}</li>
  <li><strong>Precio total:</strong> $${reserva.totalPrice}</li>
</ul>
<p>El estado de tu reserva ahora es: <strong>Confirmada</strong>.</p>
<p>Gracias por preferirnos. Si necesitas modificar o cancelar tu reserva, ingresa a tu cuenta y ve a “Mis Reservas”.</p>
<br>
<p>Saludos cordiales,<br>El equipo de <strong>Yeyian Arena</strong></p>
      `;

      // 2.7) Configurar las opciones para Nodemailer
      const mailOptions = {
        from:    process.env.EMAIL_FROM, // Ej.: "Yeyian Arena" <no-reply@yeyianarena.com>
        to:      clientEmail,
        subject: mailSubject,
        text:    mailText,
        html:    mailHtml
      };

      // 2.8) Enviar el correo con el transportador global
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('⚠️ Error al enviar correo de confirmación:', error);
          // Aunque falle el e-mail, respondemos 200 para que el front sepa que el pago está OK
          return res.status(200).json({
            warning:       'Pago confirmado, pero no se pudo enviar el correo.',
            reservationId: reservationId
          });
        } else {
          console.log('✅ Correo de confirmación enviado:', info.messageId);
          return res.status(200).json({
            success:       true,
            message:       'Pago confirmado y correo de confirmación enviado.',
            reservationId: reservationId
          });
        }
      });
    } catch (err) {
      console.error('Error POST /api/reservation/:reservationId/confirm-payment:', err);
      return res.status(500).json({ error: 'No se pudo procesar el pago' });
    }
  });

  //------------------------------------------------------
  // 3) Ruta para listar “Mis Reservas” (solo aquellas con paymentStatus = 1)
  //    GET /api/reservation/:clientId
  //------------------------------------------------------
  router.get('/:clientId', async (req, res) => {
    try {
      const { clientId } = req.params;

      const rows = await knex('reservation')
        .join(
          'reservationcosts',
          'reservation.reservationTypeId',
          'reservationcosts.reservationTypeId'
        )
        .join('client', 'reservation.clientId', 'client.clientId')
        .select(
          'reservation.reservationId',
          'reservationcosts.reservationType as reservationType',
          'reservationcosts.pricePerDay as pricePerDay',
          'client.userName as userName',
          'reservation.reservationDate',
          'reservation.reservationTime',
          'reservation.totalPrice',
          'reservation.ReservationStatus',
          'reservation.addedReservationDate'
        )
        .where('reservation.clientId', clientId)
        .andWhere('reservation.paymentStatus', 1); // Solo pagos confirmados

      return res.status(200).json(rows);
    } catch (err) {
      console.error('Error GET /api/reservation/:clientId', err);
      return res.status(500).json({ error: 'Error al obtener reservaciones' });
    }
  });

  return router;
};
