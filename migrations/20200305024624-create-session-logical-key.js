module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('sessions', 'owner_type', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.sequelize.query(
        'ALTER TABLE sessions DROP CONSTRAINT "sessions_owner_id_fkey"',
      ),
    ]),

  down: queryInterface =>
    Promise.all([queryInterface.removeColumn('sessions', 'owner_type')]),
};
