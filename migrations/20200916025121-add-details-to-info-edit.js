module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('info_edit_requests', 'details', {
      type: Sequelize.JSONB,
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('info_edit_requests', 'details'),
};
