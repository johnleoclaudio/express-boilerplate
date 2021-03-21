module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('bond_users', 'login_retry', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }),
      queryInterface.addColumn('bond_users', 'otp_retry', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }),
      queryInterface.addColumn('bond_users', 'otp_request', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }),
      queryInterface.addColumn('bond_users', 'block_otp', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('bond_users', 'login_retry'),
      queryInterface.removeColumn('bond_users', 'otp_retry'),
      queryInterface.removeColumn('bond_users', 'otp_request'),
      queryInterface.removeColumn('bond_users', 'block_otp'),
    ]);
  },
};
