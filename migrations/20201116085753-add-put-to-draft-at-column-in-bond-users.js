module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('bond_users', 'put_to_draft_at', {
      type: Sequelize.DATE,
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('bond_users', 'put_to_draft_at'),
};
