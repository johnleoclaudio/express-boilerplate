module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('sessions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      access_token: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      refresh_token: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'clients',
          key: 'id',
        },
        allowNull: false,
      },
      scope: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
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

  down: queryInterface => queryInterface.dropTable('sessions'),
};
