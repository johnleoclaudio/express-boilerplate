module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('admin_actions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      record_type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      admin_type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      details: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      owner_type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      action: {
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
  down: queryInterface => queryInterface.dropTable('admin_actions'),
};
