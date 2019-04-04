export default (sequelize, DataTypes) => {
  const BusinessSold = sequelize.define(
    'BusinessSold', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      businessType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      settlementDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      buyerName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      soldPrice: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      stockValue: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      assetValue: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      workingCapitalReq: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      propertyValue: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      year1: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      year2: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      year3: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      year4: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      nOfWorkingOwners: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      agreedWageForWorkingOwners: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      latestFullYearTotalRevenue: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      termsOfDeal: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      specialNotes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      sold: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      trend: {
        type: DataTypes.STRING,
        allowNull: true
      },
      soldDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      agreedWageForMainOwner: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: true
      },
      year1Label: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      year2Label: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      year3Label: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
      createdAt: 'dateTimeCreated',
      updatedAt: 'dateTimeModified',
      indexes: [{
        unique: true,
        fields: ['id']
      }]
    }
  )

  BusinessSold.associate = models => {
    models.BusinessSold.belongsTo(models.User, {
      foreignKey: 'createdBy_id',
      as: 'CreatedBy'
    })
    models.BusinessSold.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id',
      as: 'ModifiedBy'
    })
    models.BusinessSold.belongsTo(models.Business, {
      foreignKey: 'business_id'
    })
    models.BusinessSold.belongsTo(models.BusinessType, {
      foreignKey: 'businessType',
      as: 'BusinessType'
    })
  }

  return BusinessSold
}
