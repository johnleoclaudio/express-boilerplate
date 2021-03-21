module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('bond_users', 'block_login', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
      queryInterface.addColumn('bond_users', 'block_trade', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
      queryInterface.addColumn('bond_users', 'block_withdraw', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('bond_users', 'block_login'),
      queryInterface.removeColumn('bond_users', 'block_withdraw'),
      queryInterface.removeColumn('bond_users', 'block_trade'),
    ]);
  },
};
