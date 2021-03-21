// owner_id, owner_type, password, created_at?

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('passwords', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      owner_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    }),
  down: queryInterface => queryInterface.dropTable('passwords'),
};
