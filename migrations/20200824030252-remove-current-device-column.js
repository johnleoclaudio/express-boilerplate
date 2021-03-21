module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('otps', 'current_device'),

  down: (queryInterface, Sequelize) =>
    queryInterface.addColumn('otps', 'current_device', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }),
};
