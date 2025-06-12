exports.up = function(knex) {
  return knex.schema
    .createTable('Admin', table => {
      table.increments('adminId').primary();
      table.string('gmail', 100);
      table.string('username', 100);
      table.string('password', 100);
    })
    .createTable('Client', table => {
      table.increments('clientId').primary();
      table.string('mail', 100);
      table.string('phoneNumber', 20);
      table.string('userName', 100);
      table.string('password', 100);
      table.string('profilePicture', 255);
    })
    .createTable('Game', table => {
      table.increments('gameId').primary();
      table.string('gameName', 100);
      table.string('thumbnailImage', 200);
      table.date('releaseDate');
      table.string('genre', 100);
      table.text('lore');
      table.integer('adminId').unsigned();
      table.foreign('adminId').references('Admin.adminId');
    })
    .createTable('ReservationCosts', table => {
      table.increments('reservationTypeId').primary();
      table.string('reservationType', 100);
      table.double('pricePerDay');
    })
    .createTable('Reservation', table => {
      table.increments('reservationId').primary();
      table.date('reservationDate');
      table.boolean('paymentStatus');
      table.double('totalPrice');
      table.date('addedReservationDate');
      table.enu('ReservationStatus', [ 'approved', 'rejected']).defaultTo('approved');
      table.date('ReservationStatusDate');
      table.text('adminResponseComment');
      table.integer('reservationTypeId').unsigned();
      table.integer('clientId').unsigned();
      table.foreign('clientId').references('Client.clientId');
      table.foreign('reservationTypeId').references('ReservationCosts.reservationTypeId');
    })
    .createTable('Review', table => {
      table.increments('reviewId').primary();
      table.text('commentAdded').notNullable();
      table.timestamp('additionDate').defaultTo(knex.fn.now());
      table.integer('givenStars').notNullable();
      table.integer('clientId').unsigned().notNullable();
      table.foreign('clientId').references('Client.clientId');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('Review')
    .dropTableIfExists('Reservation')
    .dropTableIfExists('Reservation_Costs')
    .dropTableIfExists('Game')
    .dropTableIfExists('Client')
    .dropTableIfExists('Admin');
};