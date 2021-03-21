module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('user_key_pairs', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.addColumn('user_key_pairs', 'session_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
    ]),

  down: queryInterface =>
    Promise.all([
      queryInterface.removeColumn('user_key_pairs', 'user_id'),
      queryInterface.removeColumn('user_key_pairs', 'session_id'),
    ]),
};
