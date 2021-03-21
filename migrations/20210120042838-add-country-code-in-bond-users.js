module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('bond_users', 'country_code', {
      type: Sequelize.STRING,
      allowNull: true,
    }),

  down: queryInterface =>
    queryInterface.removeColumn('bond_users', 'country_code'),
};
