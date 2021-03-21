const datefns = require('date-fns');
const baseDate = new Date();

const data = [
  {
    otp: '123456',
    otp_expires_at: datefns.addMinutes(baseDate, 2),
    owner_type: 'bond_user',
    owner_id: 1,
    device_id: 'device_id',
    created_at: baseDate,
    updated_at: baseDate,
  },
  {
    otp: '654321',
    otp_expires_at: baseDate,
    owner_type: 'bond_user',
    owner_id: 1,
    device_id: 'device_id',
    created_at: baseDate,
    updated_at: baseDate,
  },
  {
    otp: '555555',
    otp_expires_at: baseDate,
    owner_type: 'bond_user',
    owner_id: 1,
    device_id: 'device_id',
    created_at: baseDate,
    updated_at: baseDate,
    verified_at: baseDate,
  },
  {
    otp: '121212',
    otp_expires_at: datefns.addMinutes(baseDate, 2),
    owner_type: 'bond_user',
    owner_id: 3,
    device_id: 'device_id',
    created_at: baseDate,
    updated_at: baseDate,
    verified_at: null,
  },
  {
    otp: '321321',
    otp_expires_at: baseDate,
    owner_type: 'bond_user',
    owner_id: 1,
    device_id: 'device_id_2',
    created_at: baseDate,
    updated_at: baseDate,
    verified_at: baseDate,
  },
];

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('otps', data),

  down: (queryInterface, sequelize) =>
    sequelize.query('truncate otps restart identity cascade'),
};
