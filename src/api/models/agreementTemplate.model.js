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
        defaultValue: '[]'
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
        allowNull: true
      },
      introductionParties: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      commissionProperty: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      addressProperty: {
        type: DataTypes.STRING,
        allowNull: true
      },
      priceProperty: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      propertyOptions: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      optionIntroductionBuyer: {
        type: DataTypes.BOOLEAN,
        allowNull: true
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
