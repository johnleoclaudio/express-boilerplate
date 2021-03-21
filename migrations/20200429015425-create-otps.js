module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('otps', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      otp: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      otp_expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      owner_type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      device_id: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

  down: queryInterface => queryInterface.dropTable('otps'),
};
