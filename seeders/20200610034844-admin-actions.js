const datefns = require('date-fns');

const baseDate = new Date();

const data = [
  {
    record_type: 'kyc',
    admin_type: 'bond',
    admin_id: 1,
    details: JSON.stringify({
      riskRating: '',
      remarks: '',
    }),
    action: 'reject',
    owner_id: 1,
    owner_type: 'bond_user',
  },
  {
    record_type: 'kyc',
    admin_type: 'bond',
    admin_id: 1,
    details: JSON.stringify({
      riskRating: '',
      remarks: '',
    }),
    action: 'reject',
    owner_id: 2,
    owner_type: 'bond_user',
    created_at: new Date(),
  },
  {
    record_type: 'kyc',
    admin_type: 'bond',
    admin_id: 1,
    details: JSON.stringify({
      riskRating: '',
      remarks: '',
    }),
    action: 'approve',
    owner_id: 2,
    owner_type: 'bond_user',
    created_at: new Date(),
  },
  {
    record_type: 'kyc',
    admin_type: 'bond',
    admin_id: 1,
    details: JSON.stringify({
      fields: ['omegalul', 'bulldog', 'washed', 'up'],
      remarks: 'sadkek',
    }),
    action: 'retry-kyc',
    owner_id: 2,
    owner_type: 'bond_user',
    created_at: new Date(),
  },
  {
    record_type: 'kyc',
    admin_type: 'bond',
    admin_id: 2,
    details: JSON.stringify({
      fields: ['omegalul', 'bulldog', 'washed', 'up'],
      remarks: 'sadkek',
    }),
    action: 'retry-kyc',
    owner_id: 2,
    owner_type: 'bond_user',
    created_at: new Date(),
  },
];

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('admin_actions', data),

  down: (queryInterface, sequelize) =>
    sequelize.query('truncate admin_actions restart identity cascade'),
};
