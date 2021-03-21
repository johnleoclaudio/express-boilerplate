module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(function() {
        return queryInterface.addColumn('bond_users', 'secure_id', {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          unique: true,
          after: 'id',
        });
      });
  },
  down: queryInterface =>
    Promise.all([queryInterface.removeColumn('bond_users', 'secure_id')]),
};
