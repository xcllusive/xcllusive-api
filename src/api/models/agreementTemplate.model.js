export default (sequelize, DataTypes) => {
  const AgreementTemplate = sequelize.define(
    'AgreementTemplate',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false
      },
      header: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      footer: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      handlebars: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:
          '["owner_first_name", "owner_last_name", "owner_phone", "business_abn", "business_address", "forsale_business_known","conducted_at", "listed_price", "appraisal_high", "appraisal_low", "engagement_fee", "commission_perc", "commission_discount", "introduction_parties", "commission_property", "address_property", "price_property"]'
      },
      engagementFee: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      commissionPerc: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      commissionDiscount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 20.0
      },
      introductionParties: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
      },
      commissionProperty: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 2.5
      },
      addressProperty: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      priceProperty: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      propertyOptions: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      optionIntroductionBuyer: {
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

  AgreementTemplate.associate = models => {
    models.AgreementTemplate.belongsTo(models.User, {
      foreignKey: 'createdBy_id'
    })
    models.AgreementTemplate.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id'
    })
  }

  return AgreementTemplate
}
