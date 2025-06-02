// app.js
const express = require('express');
const cors = require('cors'); //para poder ejecutar react y express en diferentes puertos

const knexConfig = require('./knexfile.cjs');
const knex = require('knex')(knexConfig.development);
const reviewsRouter = require('./routes/reviews')(knex);
const registerRouter = require('./routes/register')(knex);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/reviews', reviewsRouter);
app.use('/api/register', registerRouter);



app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));

