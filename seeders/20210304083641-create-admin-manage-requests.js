const data = [
  {
    scope: 'bond',
    type: 'create',
    details: JSON.stringify({
      email: 'test@test.com',
      role: 'cs_maker',
      accessLevel: 1,
    }),
    requested_by: 1,
    requested_at: new Date(),
    request_reason: 'test',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('admin_manage_requests', data),

  down: (queryInterface, sequelize) =>
    sequelize.query('truncate admin_manage_requests restart identity cascade'),
};
