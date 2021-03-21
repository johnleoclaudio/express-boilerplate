module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'bond_users',
        'generated_investor_csv_report_at',
        {
          type: Sequelize.DATE,
        },
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        'bond_users',
        'generated_investor_csv_report_at',
      ),
    ]);
  },
};
