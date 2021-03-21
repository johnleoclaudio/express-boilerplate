module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('sessions', 'refreshed_at', {
        type: Sequelize.DATE,
      }),
    ]),

  down: queryInterface =>
    Promise.all([queryInterface.removeColumn('sessions', 'refreshed_at')]),
};
