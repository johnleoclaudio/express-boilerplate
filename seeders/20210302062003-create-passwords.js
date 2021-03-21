const data = [
  {
    owner_id: 2,
    owner_type: 'admin',
    password: '$2a$10$sl0p1hKspsVbGs5nzjy4vOeOTz8qRyb3XFZ95paoS4xiqUPsDdlba',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    owner_id: 2,
    owner_type: 'admin',
    password: '$2a$04$A814XGjCmY5m9/SI2AZ2G.TiLOrMvHt1m8/crNvvSUFXQjtAv1sye', // P@ssw0rd1!!
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    owner_id: 2,
    owner_type: 'admin',
    password: '$2a$04$5jJs2tWAj0BCnOn9OL1jEuyd2TkDLfFixB4jeevl0iO1edCmgsZgO', // P@ssw0rd1!
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    owner_id: 2,
    owner_type: 'admin',
    password: '$2a$04$mTiudaYX16qIlAlC2gmEAeVPi0BIhynGPYkzO0fhSUfrSodzjj4BW', // P@ssw0rd1!!!
    created_at: new Date(),
    updated_at: new Date(),
  },
];

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('passwords', data),

  down: (queryInterface, sequelize) =>
    sequelize.query('truncate passwords restart identity cascade'),
};
