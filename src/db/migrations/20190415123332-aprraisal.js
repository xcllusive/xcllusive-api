'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Appraisals', 'calcGrossProfit7', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfit7', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfitPerc7', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      })
    ])
  },

  down: queryInterface => {
    return Promise.all([queryInterface.removeColumn('Appraisals', 'calcGrossProfit7'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfit7'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfitPerc7')])
  }
}
