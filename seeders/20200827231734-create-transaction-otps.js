const datefns = require('date-fns');
const baseDate = new Date();

const data = [
  {
    otp: '123456',
    otp_expires_at: datefns.addMinutes(baseDate, 5),
    owner_type: 'bond_user',
    owner_id: 1,
    transaction_type: 'cash_out',
    created_at: baseDate,
    updated_at: baseDate,
  },
  {
    otp: '123457',
    otp_expires_at: datefns.subMinutes(baseDate, 5),
    owner_type: 'bond_user',
    owner_id: 1,
    transaction_type: 'cash_out',
    created_at: baseDate,
    updated_at: baseDate,
  },
  {
    otp: '123457',
    otp_expires_at: datefns.addMinutes(baseDate, 5),
    owner_type: 'bond_user',
    owner_id: 1,
    transaction_type: 'buy',
    created_at: baseDate,
    updated_at: baseDate,
  },
];

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('transaction_otps', data),

  down: (queryInterface, sequelize) =>
    sequelize.query('truncate transaction_otps restart identity cascade'),
};
