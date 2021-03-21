const datefns = require('date-fns');

const baseDate = new Date();

const data = [
  {
    code: 'ver_code',
    owner_type: 'bond_user',
    owner_id: 3,
    expires_at: datefns.addHours(baseDate, 24),
  },
  {
    code: 'ver_code_2',
    owner_type: 'bond_user',
    owner_id: 4,
    expires_at: datefns.startOfDay(baseDate),
  },
];

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('verification_codes', data),

  down: (queryInterface, sequelize) =>
    sequelize.query('truncate verification_codes restart identity cascade'),
};
