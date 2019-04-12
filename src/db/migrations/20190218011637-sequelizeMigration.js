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
      queryInterface.addColumn(
        'Appraisal',
        'calcAnnualised1', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcAnnualised2', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcAnnualised5', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcAnnualised7', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMargin1', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMargin2', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMargin3', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMargin4', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMargin5', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMargin6', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMargin7', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMarginPerc1', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMarginPerc2', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMarginPerc3', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMarginPerc4', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMarginPerc5', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMarginPerc6', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossMarginPerc7', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossProfit1', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossProfit2', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossProfit3', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossProfit4', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossProfit5', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcGrossProfit6', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcOperatingProfit1', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcOperatingProfit1', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcOperatingProfit2', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcOperatingProfit3', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcOperatingProfit4', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcOperatingProfit5', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcOperatingProfit6', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcOperatingProfitPerc1', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcOperatingProfitPerc2', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcOperatingProfitPerc3', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcOperatingProfitPerc4', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcOperatingProfitPerc5', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'calcOperatingProfitPerc6', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'smallestMultiplier', {
          type: Sequelize.DOUBLE,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'avgMultiplier', {
          type: Sequelize.DOUBLE,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'avgMultiplier', {
          type: Sequelize.DOUBLE,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'riskPremium', {
          type: Sequelize.DOUBLE,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'askingPrice', {
          type: Sequelize.DOUBLE,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'lessThan5PercChanceOfSelling', {
          type: Sequelize.DOUBLE,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'formulaValuePricingMethod', {
          type: Sequelize.String,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'formulaPriceBasedOnComparable', {
          type: Sequelize.String,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'formulaRiskPremium', {
          type: Sequelize.String,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'formulaMarketPremium', {
          type: Sequelize.String,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'formulaNegotiationPremium', {
          type: Sequelize.String,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'formulaAskingPrice', {
          type: Sequelize.String,
          allowNull: true,
          defaultValue: 0
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'renderPdfYear1', {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: 1
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'renderPdfYear2', {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: 1
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'renderPdfYear3', {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: 1
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'renderPdfYear4', {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: 1
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'renderPdfYear5', {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: 1
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'renderPdfYear7', {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: 1
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'askingPriceValue1', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 1
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'askingPriceValue2', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 1
        }
      ), queryInterface.addColumn(
        'Appraisal',
        'inclStock', {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: 1
        }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
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
      queryInterface.removeColumn(
        'Appraisal',
        'calcAnnualised1'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcAnnualised2'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcAnnualised5'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcAnnualised7'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossMargin1'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossMargin2'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossMargin3'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossMargin4'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossMargin5'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossMargin6'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossMarginPerc1'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossMarginPerc2'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossMarginPerc3'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossMarginPerc4'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossMarginPerc5'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossMarginPerc6'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossProfit1'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossProfit2'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossProfit3'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossProfit4'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossProfit5'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcGrossProfit6'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcOperatingProfit1'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcOperatingProfit1'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcOperatingProfit2'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcOperatingProfit3'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcOperatingProfit4'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcOperatingProfit5'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcOperatingProfit6'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcOperatingProfitPerc1'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcOperatingProfitPerc2'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcOperatingProfitPerc3'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcOperatingProfitPerc4'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcOperatingProfitPerc5'
      ), queryInterface.removeColumn(
        'Appraisal',
        'calcOperatingProfitPerc6'
      ), queryInterface.removeColumn(
        'Appraisal',
        'smallestMultiplier'
      ), queryInterface.removeColumn(
        'Appraisal',
        'avgMultiplier'
      ), queryInterface.removeColumn(
        'Appraisal',
        'avgMultiplier'
      ), queryInterface.removeColumn(
        'Appraisal',
        'riskPremium'
      ), queryInterface.removeColumn(
        'Appraisal',
        'askingPrice'
      ), queryInterface.removeColumn(
        'Appraisal',
        'lessThan5PercChanceOfSelling'
      ), queryInterface.removeColumn(
        'Appraisal',
        'formulaValuePricingMethod'
      ), queryInterface.removeColumn(
        'Appraisal',
        'formulaPriceBasedOnComparable'
      ), queryInterface.removeColumn(
        'Appraisal',
        'formulaRiskPremium'
      ), queryInterface.removeColumn(
        'Appraisal',
        'formulaMarketPremium'
      ), queryInterface.removeColumn(
        'Appraisal',
        'formulaNegotiationPremium'
      ), queryInterface.removeColumn(
        'Appraisal',
        'formulaAskingPrice'
      ), queryInterface.removeColumn(
        'Appraisal',
        'renderPdfYear1'
      ), queryInterface.removeColumn(
        'Appraisal',
        'renderPdfYear2'
      ), queryInterface.removeColumn(
        'Appraisal',
        'renderPdfYear3'
      ), queryInterface.removeColumn(
        'Appraisal',
        'renderPdfYear4'
      ), queryInterface.removeColumn(
        'Appraisal',
        'renderPdfYear5'
      ), queryInterface.removeColumn(
        'Appraisal',
        'renderPdfYear7'
      ), queryInterface.removeColumn(
        'Appraisal',
        'askingPriceValue1'
      ), queryInterface.removeColumn(
        'Appraisal',
        'askingPriceValue2'
      ), queryInterface.removeColumn(
        'Appraisal',
        'inclStock'
      )
    ])
  }
}
