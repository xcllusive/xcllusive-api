export default (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: true
    },
    businessCat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    commissionPerc: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    commissionSold: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    conclusionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    listed: {
      type: DataTypes.STRING,
      allowNull: true
    },
    active: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    afterSalesNotes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessABN: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessDescriptionShort: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    businessNameLabel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessNameSecondary: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessPartner: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessSource: {
      type: DataTypes.STRING,
      allowNull: false
    },
    businessType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessURL: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cCreatedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    chartSelScore: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cModifiedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    countAttBuyers: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    currentPrice: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    data120DayGuarantee: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dataRegion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateChangedToForSale: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateChangedToSalesMemorandum: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dayGeneratedIWP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    firstNameV: {
      type: DataTypes.STRING,
      allowNull: false
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    listedPrice: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    listingAgent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lostDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    mailingAddressV: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modificationBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modificationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notifyOwner: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ownersTime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postCode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    recID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sort: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sourceNotes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    staffAccountName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    suburb: {
      type: DataTypes.STRING,
      allowNull: true
    },
    saleNotesLostMeeting: {
      type: DataTypes.STRING,
      allowNull: true
    },
    saleNotesLostWant: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastNameV: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vendorEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vendorFax: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vendorPhone1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vendorPhone2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vendorPhone3: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    createdAt: 'dateTimeCreated',
    updatedAt: 'dateTimeModified',
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ]
  })

  Business.associate = (models) => {
    models.Business.belongsTo(models.BusinessStage, { foreignKey: 'stageId' })
    models.Business.belongsTo(models.BusinessSource, { foreignKey: 'sourceId' })
    models.Business.belongsTo(models.BusinessRating, { foreignKey: 'ratingId' })
    models.Business.belongsTo(models.BusinessIndustry, { foreignKey: 'industryId' })
    models.Business.belongsTo(models.BusinessOwnersTime, { foreignKey: 'ownersTimeId' })
    models.Business.belongsTo(models.BusinessProduct, { foreignKey: 'productId' })
    models.Business.belongsTo(models.BusinessType, { foreignKey: 'typeId' })
  }

  return Business
}
