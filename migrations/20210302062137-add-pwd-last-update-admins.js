'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('admins', 'password_updated_at', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('admins', 'password_updated_at'),
    ]);
  },
};
