const knex = require('knex');
const config = require('./knexfile.cjs');

const db = knex(config.development);

module.exports = db;
