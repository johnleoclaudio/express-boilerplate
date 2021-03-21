const data = [
  {
    device_id: '123',
    api_secret: 'api_secret',
    api_key: 'api_key',
    user_id: 1,
    session_id: 1,
  },
];

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('user_key_pairs', data),

  down: (queryInterface, sequelize) =>
    sequelize.query('truncate user_key_pairs restart identity cascade'),
};
