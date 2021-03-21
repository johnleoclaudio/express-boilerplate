module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('user_key_pairs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      device_id: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      api_secret: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      api_key: {
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

  down: queryInterface => queryInterface.dropTable('user_key_pairs'),
};
