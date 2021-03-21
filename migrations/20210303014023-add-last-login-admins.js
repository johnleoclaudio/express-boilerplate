'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('admins', 'last_login_at', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('admins', 'last_login_at'),
    ]);
  },
};
