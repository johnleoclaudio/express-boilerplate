module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('bond_users', 'kyc_approved_at', {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn('bond_users', 'kyc_approved_by', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn('bond_users', 'kyc_verified_at', {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn('bond_users', 'kyc_verified_by', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn('bond_users', 'risk_rating', {
        type: Sequelize.TEXT,
      }),
      queryInterface.addColumn('bond_users', 'retry_kyc', {
        type: Sequelize.BOOLEAN,
      }),
    ]),

  down: queryInterface =>
    Promise.all([
      queryInterface.removeColumn('bond_users', 'kyc_approved_at'),
      queryInterface.removeColumn('bond_users', 'kyc_approved_by'),
      queryInterface.removeColumn('bond_users', 'kyc_verified_at'),
      queryInterface.removeColumn('bond_users', 'kyc_verified_by'),
      queryInterface.removeColumn('bond_users', 'risk_rating'),
      queryInterface.removeColumn('bond_users', 'retry_kyc'),
    ]),
};
