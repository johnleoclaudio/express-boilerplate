module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('client_key_pairs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      client_id: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      secret_key: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      logo: {
        type: Sequelize.TEXT,
      },
      unique_identifier: {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: false,
      },
      callback: {
        type: Sequelize.JSONB,
      },
      scope: {
        type: Sequelize.TEXT,
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
  down: queryInterface => queryInterface.dropTable('client_key_pairs'),
};
