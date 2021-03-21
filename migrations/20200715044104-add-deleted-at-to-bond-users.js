module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('bond_users', 'deleted_at', {
        type: Sequelize.DATE,
      }),
      queryInterface.removeConstraint('bond_users', 'bond_users_email_key'),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('bond_users', 'deleted_at'),
      queryInterface.changeColumn('bond_users', 'email', {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      }),
    ]);
  },
};
