const data = [
  {
    first_name: 'Joe',
    last_name: 'Taro',
    email: 'joet@ro.com',
    password: '$2a$10$sl0p1hKspsVbGs5nzjy4vOeOTz8qRyb3XFZ95paoS4xiqUPsDdlba',
    contact_number: '639274728171',
    secure_id: 'abcd-1234',
  },
];

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('clients', data),

  down: (queryInterface, sequelize) =>
    sequelize.query('truncate clients restart identity cascade'),
};
