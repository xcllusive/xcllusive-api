'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.addColumn('Appraisals', 'calcAnnualised1', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcAnnualised2', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcAnnualised5', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcAnnualised7', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMargin1', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMargin2', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMargin3', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMargin4', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMargin5', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMargin6', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMargin7', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMarginPerc1', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMarginPerc2', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMarginPerc3', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMarginPerc4', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMarginPerc5', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMarginPerc6', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossMarginPerc7', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossProfit1', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossProfit2', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossProfit3', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossProfit4', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossProfit5', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcGrossProfit6', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfit1', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfit2', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfit3', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfit4', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfit5', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfit6', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfitPerc1', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfitPerc2', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfitPerc3', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfitPerc4', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfitPerc5', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'calcOperatingProfitPerc6', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'smallestMultiplier', {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'avgMultiplier', {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'riskPremium', {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'askingPrice', {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'lessThan5PercChanceOfSelling', {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'formulaValuePricingMethod', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'formulaPriceBasedOnComparable', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'formulaRiskPremium', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'formulaMarketPremium', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'formulaNegotiationPremium', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'formulaAskingPrice', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
      }), queryInterface.addColumn('Appraisals', 'renderPdfYear1', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1
      }), queryInterface.addColumn('Appraisals', 'renderPdfYear2', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1
      }), queryInterface.addColumn('Appraisals', 'renderPdfYear3', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1
      }), queryInterface.addColumn('Appraisals', 'renderPdfYear4', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1
      }), queryInterface.addColumn('Appraisals', 'renderPdfYear5', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1
      }), queryInterface.addColumn('Appraisals', 'renderPdfYear7', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1
      }), queryInterface.addColumn('Appraisals', 'askingPriceValue1', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 1
      }), queryInterface.addColumn('Appraisals', 'askingPriceValue2', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 1
      }), queryInterface.addColumn('Appraisals', 'inclStock', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1
      }), queryInterface.addColumn('Appraisals', 'testMigration', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1
      })
    ])
  },

  down: queryInterface => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    // return Promise.all([
    //   queryInterface.removeColumn(
    //     'testMigration',
    //     'shit'
    //   ), queryInterface.removeColumn(
    //     'testMigration',
    //     'poo'
    //   )
    // ])
    return Promise.all([
      queryInterface.removeColumn('Appraisals', 'calcAnnualised1'), queryInterface.removeColumn('Appraisals', 'calcAnnualised2'), queryInterface.removeColumn('Appraisals', 'calcAnnualised5'), queryInterface.removeColumn('Appraisals', 'calcAnnualised7'), queryInterface.removeColumn('Appraisals', 'calcGrossMargin1'), queryInterface.removeColumn('Appraisals', 'calcGrossMargin2'), queryInterface.removeColumn('Appraisals', 'calcGrossMargin3'), queryInterface.removeColumn('Appraisals', 'calcGrossMargin4'), queryInterface.removeColumn('Appraisals', 'calcGrossMargin5'), queryInterface.removeColumn('Appraisals', 'calcGrossMargin6'), queryInterface.removeColumn('Appraisals', 'calcGrossMarginPerc1'), queryInterface.removeColumn('Appraisals', 'calcGrossMarginPerc2'), queryInterface.removeColumn('Appraisals', 'calcGrossMarginPerc3'), queryInterface.removeColumn('Appraisals', 'calcGrossMarginPerc4'), queryInterface.removeColumn('Appraisals', 'calcGrossMarginPerc5'), queryInterface.removeColumn('Appraisals', 'calcGrossMarginPerc6'), queryInterface.removeColumn('Appraisals', 'calcGrossProfit1'), queryInterface.removeColumn('Appraisals', 'calcGrossProfit2'), queryInterface.removeColumn('Appraisals', 'calcGrossProfit3'), queryInterface.removeColumn('Appraisals', 'calcGrossProfit4'), queryInterface.removeColumn('Appraisals', 'calcGrossProfit5'), queryInterface.removeColumn('Appraisals', 'calcGrossProfit6'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfit1'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfit2'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfit3'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfit4'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfit5'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfit6'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfitPerc1'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfitPerc2'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfitPerc3'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfitPerc4'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfitPerc5'), queryInterface.removeColumn('Appraisals', 'calcOperatingProfitPerc6'), queryInterface.removeColumn('Appraisals', 'smallestMultiplier'), queryInterface.removeColumn('Appraisals', 'avgMultiplier'), queryInterface.removeColumn('Appraisals', 'riskPremium'), queryInterface.removeColumn('Appraisals', 'askingPrice'), queryInterface.removeColumn('Appraisals', 'lessThan5PercChanceOfSelling'), queryInterface.removeColumn('Appraisals', 'formulaValuePricingMethod'), queryInterface.removeColumn('Appraisals', 'formulaPriceBasedOnComparable'), queryInterface.removeColumn('Appraisals', 'formulaRiskPremium'), queryInterface.removeColumn('Appraisals', 'formulaMarketPremium'), queryInterface.removeColumn('Appraisals', 'formulaNegotiationPremium'), queryInterface.removeColumn('Appraisals', 'formulaAskingPrice'), queryInterface.removeColumn('Appraisals', 'renderPdfYear1'), queryInterface.removeColumn('Appraisals', 'renderPdfYear2'), queryInterface.removeColumn('Appraisals', 'renderPdfYear3'), queryInterface.removeColumn('Appraisals', 'renderPdfYear4'), queryInterface.removeColumn('Appraisals', 'renderPdfYear5'), queryInterface.removeColumn('Appraisals', 'renderPdfYear7'), queryInterface.removeColumn('Appraisals', 'askingPriceValue1'), queryInterface.removeColumn('Appraisals', 'askingPriceValue2'), queryInterface.removeColumn('Appraisals', 'inclStock'), queryInterface.removeColumn('Appraisals', 'testMigration')
    ])
  }
}
