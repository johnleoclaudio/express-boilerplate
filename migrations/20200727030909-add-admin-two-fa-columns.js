'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('admins', 'two_fa_secret', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('admins', 'two_fa_verified', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('admins', 'two_fa_secret'),
      queryInterface.removeColumn('admins', 'two_fa_verified'),
    ]);
  },
};
