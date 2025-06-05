// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); //para poder ejecutar react y express en diferentes puertos
const knexConfig = require('./knexfile.cjs');
const knex= require('knex')(knexConfig.development);

const app = express();
app.use(cors());
app.use(express.json());

const reviewsRouter = require('./routes/reviews')(knex);
const registerRouter = require('./routes/register')(knex);
const loginRouter = require('./routes/login')(knex);
const reservationsRouter = require('./routes/reservation')(knex);

app.use('/api/reviews', reviewsRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/reservation', reservationsRouter);

app.get('/', (req, res) => {
  res.send('Servidor funcionando en /api/register y /api/login');
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));

