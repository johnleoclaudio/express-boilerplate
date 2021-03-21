module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('verification_codes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: Sequelize.TEXT,
        defaultValue: Sequelize.literal('MD5(random()::text)'),
        unique: true,
        after: 'id',
      },
      owner_type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
      },
      verified_at: {
        type: Sequelize.DATE,
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

  down: queryInterface => queryInterface.dropTable('verification_codes'),
};
