module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.changeColumn('admin_actions', 'admin_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'admins',
          key: 'id',
        },
      }),
    ]),
  down: queryInterface =>
    Promise.all([
      queryInterface.changeColumn('admin_actions', 'admin_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
    ]),
};
