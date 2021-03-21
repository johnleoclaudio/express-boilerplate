module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('admins', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      role: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.TEXT,
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
  down: queryInterface => queryInterface.dropTable('admins'),
};
