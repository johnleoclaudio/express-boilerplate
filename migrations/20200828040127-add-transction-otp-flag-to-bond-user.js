'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('bond_users', 'block_require_txn_otp', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
      queryInterface.addColumn('bond_users', 'block_txn_otp', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
      queryInterface.addColumn('bond_users', 'txn_otp_request', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }),
      queryInterface.addColumn('bond_users', 'txn_otp_retry', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('bond_users', 'block_require_txn_otp'),
      queryInterface.removeColumn('bond_users', 'block_txn_otp'),
      queryInterface.removeColumn('bond_users', 'txn_otp_request'),
      queryInterface.removeColumn('bond_users', 'txn_otp_retry'),
    ]);
  },
};
