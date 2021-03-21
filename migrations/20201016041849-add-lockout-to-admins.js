module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('admins', 'login_retry', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }),
      queryInterface.addColumn('admins', 'block_login', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('admins', 'login_retry'),
      queryInterface.removeColumn('admins', 'block_login'),
    ]);
  },
};
