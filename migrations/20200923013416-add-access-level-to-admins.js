'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('admins', 'access_level', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2, // write access
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn('admins', 'access_level')]);
  },
};
