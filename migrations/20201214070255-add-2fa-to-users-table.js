module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('bond_users', 'two_fa_secret', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('bond_users', 'two_fa_enabled', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
    ]),

  down: queryInterface =>
    Promise.all([
      queryInterface.removeColumn('bond_users', 'two_fa_secret'),
      queryInterface.removeColumn('bond_users', 'two_fa_enabled'),
    ]),
};
