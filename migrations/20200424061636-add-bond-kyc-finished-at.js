module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('bond_users', 'kyc_finished_at', {
        type: Sequelize.DATE,
      }),
    ]),

  down: queryInterface =>
    Promise.all([queryInterface.removeColumn('bond_users', 'kyc_finished_at')]),
};
