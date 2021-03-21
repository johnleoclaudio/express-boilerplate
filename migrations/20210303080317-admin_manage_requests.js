module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('admin_manage_requests', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      scope: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      details: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      requested_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      requested_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      request_reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      approved_at: {
        type: Sequelize.DATE,
      },
      approved_by: {
        type: Sequelize.INTEGER,
      },
      approval_comment: {
        type: Sequelize.TEXT,
      },
      rejected_at: {
        type: Sequelize.DATE,
      },
      rejected_by: {
        type: Sequelize.INTEGER,
      },
      rejection_comment: {
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
  down: queryInterface => queryInterface.dropTable('admin_manage_requests'),
};
