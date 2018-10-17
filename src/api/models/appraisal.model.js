export default (sequelize, DataTypes) => {
  const Appraisal = sequelize.define(
    'Appraisal',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      confirmBusinessDetail: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      productsServices: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
      },
      businessCommenced: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      currentOwner: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      tradingHours: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      nOfBusinessLocations: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      confirmAbout: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      descriptionCustomers: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      clientDatabaseAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      client10TO: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      descriptionClient10TO: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      client5TO: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      descriptionSuppliers: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      confirmCustomersSuppliers: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      premisesOwnedRented: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      rentCost: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      timeRemLease: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      premisesNotes: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      fullTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      partTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      subContractors: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      casuals: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      confirmPremisesEnployees: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      numberOwners: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      owners1sHours: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      owners1sRole: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      otherOwnersHours: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      otherOwnersRole: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      otherRelevantNotes: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      confirmOwnershipFinalNotes: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      monthsCovered: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      seasonalAdjustment: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      year1: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      year2: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      year3: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      year4: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      year5: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      year6: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      sales1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sales2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sales3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sales4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sales5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sales6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sales7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      salesYesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      cogs1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      cogs2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      cogs3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      cogs4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      cogs5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      cogs6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      cogs7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      cogsYesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      grossMargin1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      grossMargin2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      grossMargin3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      grossMargin4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      grossMargin5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      grossMargin6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      grossMargin7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      grossMarginPerc1: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      grossMarginPerc2: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      grossMarginPerc3: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      grossMarginPerc4: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      grossMarginPerc5: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      grossMarginPerc6: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      grossMarginPerc7: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      otherIncome1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      otherIncome2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      otherIncome3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      otherIncome4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      otherIncome5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      otherIncome6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      otherIncome7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      otherIncomeYesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      grossProfit1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      grossProfit2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      grossProfit3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      grossProfit4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      grossProfit5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      grossProfit6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      grossProfit7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      expenses1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      expenses2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      expenses3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      expenses4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      expenses5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      expenses6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      expenses7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      expensesYesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      operatingProfit1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      operatingProfit2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      operatingProfit3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      operatingProfit4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      operatingProfit5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      operatingProfit6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      operatingProfit7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      operatingProfitPerc1: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      operatingProfitPerc2: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      operatingProfitPerc3: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      operatingProfitPerc4: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      operatingProfitPerc5: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      operatingProfitPerc6: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      operatingProfitPerc7: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      aaRow1: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow1Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow1Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow1Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow1Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow1Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow1Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow1Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow1YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow2: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow2Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow2Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow2Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow2Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow2Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow2Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow2Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow2YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow3: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow3Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow3Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow3Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow3Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow3Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow3Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow3Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow3YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow4: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow4Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow4Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow4Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow4Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow4Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow4Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow4Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow4YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow5: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow5Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow5Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow5Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow5Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow5Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow5Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow5Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow5YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow6: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow6Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow6Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow6Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow6Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow6Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow6Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow6Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow6YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow7: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow7Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow7Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow7Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow7Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow7Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow7Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow7Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow7YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow8: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow8Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow8Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow8Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow8Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow8Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow8Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow8Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow8YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow9: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow9Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow9Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow9Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow9Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow9Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow9Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow9Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow9YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow10: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow10Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow10Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow10Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow10Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow10Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow10Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow10Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow10YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow11: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow11Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow11Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow11Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow11Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow11Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow11Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow11Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow11YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow12: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow12Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow12Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow12Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow12Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow12Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow12Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow12Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow12YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow13: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow13Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow13Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow13Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow13Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow13Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow13Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow13Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow13YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow14: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow14Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow14Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow14Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow14Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow14Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow14Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow14Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow14YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow15: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow15Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow15Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow15Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow15Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow15Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow15Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow15Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow15YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow16: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow16Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow16Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow16Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow16Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow17Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow17Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow17Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow17YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow18: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow18Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow18Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow18Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow18Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow18Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow18Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow18Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow18YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow19: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow19Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow19Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow19Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow19Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow19Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow19Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow19Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow19YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow20: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow20Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow20Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow20Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow20Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow20Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow20Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow20Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow20YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow21: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow21Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow21Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow21Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow21Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow21Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow21Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow21Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow21YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow22: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow22Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow22Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow22Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow22Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow22Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow22Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow22Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow22YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow23: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow23Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow23Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow23Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow23Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow23Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow23Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow23Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow23YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow24: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow24Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow24Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow24Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow24Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow24Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow24Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow24Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow24YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow25: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow25Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow25Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow25Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow25Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow25Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow25Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow25Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow25YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow26: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow26Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow26Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow26Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow26Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow26Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow26Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow26Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow26YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow27: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow27Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow27Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow27Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow27Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow27Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow27Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow27Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow27YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow28: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow28Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow28Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow28Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow28Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow28Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow28Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow28Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow28YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow29: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow29Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow29Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow29Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow29Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow29Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow29Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow29Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow29YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow30: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow30Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow30Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow30Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow30Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow30Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow30Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow30Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow30YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      totalAdjusments1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAdjusments2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAdjusments3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAdjusments4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAdjusments5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAdjusments6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAdjusments7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAdjustedProfit1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAdjustedProfit2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAdjustedProfit3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAdjustedProfit4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAdjustedProfit5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAdjustedProfit6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAdjustedProfit7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      adjustedProfitPerc1: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      adjustedProfitPerc2: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      adjustedProfitPerc3: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      adjustedProfitPerc4: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      adjustedProfitPerc5: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      adjustedProfitPerc6: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      adjustedProfitPerc7: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      owner1Position: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      owner1HoursPWeek: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      owner1AnnualWage: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      owner2Position: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      owner2HoursPWeek: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      owner2AnnualWage: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      owner3Position: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      owner3HoursPWeek: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      owner3AnnualWage: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      owner4Position: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      owner4HoursPWeek: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      owner4AnnualWage: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      owner5Position: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      owner5HoursPWeek: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      owner5AnnualWage: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      owner6Position: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      owner6HoursPWeek: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      owner6AnnualWage: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      owner7Position: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      owner7HoursPWeek: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      owner7AnnualWage: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      totalAnnualWages: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      noStock: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      currentStockLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      currentStockLevelYesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      stockNecessary: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      stockNecessaryYesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      physicalAssetValue: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      financialInfoSource: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      confirmFinancialAnalysis: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      completed: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      sentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      riskList: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      criticalIssuesList: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      valueDriversList: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      valueSliderBR: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 50
      },
      valueSliderMarket: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 50
      },
      confirmBusinessAnalysis: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      comparableDataSelectedList: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      pricingMethod: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      confirmComparableData: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      sumMEbitdaLastYear: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sumMEbitdaAvg: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sumMPebitdaLastYear: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sumMPebitdaAvg: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sumMEbitdaLastYearWithStock: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sumMEbitdaAvgWithStock: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sumMPebitdaLastYearWithStock: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sumMPebitdaAvgWithStock: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sumMTO: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      sumAssetsValue: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      }
    },
    {
      createdAt: 'dateTimeCreated',
      updatedAt: 'dateTimeModified',
      indexes: [
        {
          unique: true,
          fields: ['id']
        }
      ]
    }
  )

  Appraisal.associate = models => {
    models.Appraisal.belongsTo(models.User, {
      foreignKey: 'createdBy_id',
      as: 'CreatedBy'
    })
    models.Appraisal.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id',
      as: 'ModifiedBy'
    })
    models.Appraisal.belongsTo(models.Business, {
      foreignKey: 'business_id'
    })
  }

  return Appraisal
}
