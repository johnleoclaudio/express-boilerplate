module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('info_edit_requests', {
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
      edited_category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      edited_field: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      edited_field_previous_info: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      edited_field_new_info: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      edited_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      edited_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      edit_reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      approved_at: {
        type: Sequelize.DATE,
      },
      approved_by: {
        type: Sequelize.STRING,
      },
      approval_comment: {
        type: Sequelize.TEXT,
      },
      declined_at: {
        type: Sequelize.DATE,
      },
      declined_by: {
        type: Sequelize.STRING,
      },
      denial_comment: {
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
  down: queryInterface => queryInterface.dropTable('info_edit_requests'),
};
