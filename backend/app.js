// app.js


require('dotenv').config();
const express     = require('express');
const cors        = require('cors'); //para poder ejecutar react y express en diferentes puertos
const knexConfig  = require('./db/knexfile.cjs');
const knex        = require('knex')(knexConfig.development);
const app         = express();
const clientRouter = require("./routes/client")(knex);
const path        = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cors());

const reviewsRouter = require('./routes/reviews')(knex);
const videogamesRouter = require('./routes/videogames')(knex);
const registerRouter = require('./routes/register')(knex);
const loginRouter = require('./routes/login')(knex);
const reservationRouter = require('./routes/reservation')(knex);
const stripeRouter = require('./routes/stripe');
const occupiedDatesRouter = require('./routes/occupied-dates')(knex);
const configReservationsRouter = require('./routes/adminReservations')(knex);
const configEventTypeRouter = require('./routes/modifyResType')(knex);
const trackRouter         = require('./routes/track')(knex)
const adminRouter         = require('./routes/adminStats')(knex)

app.use("/api/client", clientRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/videogames', videogamesRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/reservation', reservationRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/occupied-dates', occupiedDatesRouter);
app.use('/api/config-reservations', configReservationsRouter);
app.use('/api/config-event-type', configEventTypeRouter);
app.use('/api/track',    trackRouter);
app.use('/api/admin',    adminRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
