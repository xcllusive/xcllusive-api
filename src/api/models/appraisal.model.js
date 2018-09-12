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
      businessName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      businessABN: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      streetName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      suburb: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      postCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      confirmBusinessDetail: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      businessType: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      businessIndustry: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
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
      seasonalAdjusment: {
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
      aaRow01: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow01Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow01Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow01Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow01Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow01Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow01Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow01Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow01YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow02: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow02Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow02Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow02Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow02Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow02Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow02Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow02Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow02YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow03: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow03Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow03Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow03Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow03Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow03Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow03Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow03Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow03YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow04: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow04Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow04Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow04Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow04Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow04Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow04Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow04Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow04YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow05: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow05Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow05Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow05Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow05Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow05Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow05Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow05Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow05YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow06: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow06Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow06Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow06Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow06Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow06Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow06Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow06Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow06YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow07: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow07Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow07Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow07Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow07Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow07Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow07Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow07Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow07YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow08: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow08Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow08Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow08Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow08Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow08Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow08Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow08Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow08YesNo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      aaRow09: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      aaRow09Year1: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow09Year2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow09Year3: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow09Year4: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow09Year5: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow09Year6: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow09Year7: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },
      aaRow09YesNo: {
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

  return Appraisal
}
