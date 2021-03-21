const data = [
  {
    username: 'nicco.enriquez@pdax.ph',
    pin: '1234',
  },
];

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('users', data),

  down: (queryInterface, sequelize) =>
    sequelize.query('truncate users restart identity cascade'),
};
