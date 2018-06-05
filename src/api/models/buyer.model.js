export default (sequelize, DataTypes) => {
  const Buyer = sequelize.define(
    'Buyer',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      region: {
        type: DataTypes.STRING,
        allowNull: true
      },
      buyerNotes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      smSent: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      smSentDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      active: {
        type: DataTypes.STRING,
        allowNull: true
      },
      address2: {
        type: DataTypes.STRING,
        allowNull: true
      },
      businessIndustry: {
        type: DataTypes.STRING,
        allowNull: true
      },
      buyerType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      buyerSource: {
        type: DataTypes.STRING,
        allowNull: true
      },
      caReceived: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      caSent: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      checkAddress: {
        type: DataTypes.STRING,
        allowNull: true
      },
      checkEmail: {
        type: DataTypes.STRING,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      emailOptional: {
        type: DataTypes.STRING,
        allowNull: true
      },
      fax: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mailingAddress: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      newsletter: {
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
      priceFrom: {
        type: DataTypes.STRING,
        allowNull: true
      },
      priceTo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      scanfilePath: {
        type: DataTypes.STRING,
        allowNull: true
      },
      stage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true
      },
      streetName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      suburb: {
        type: DataTypes.STRING,
        allowNull: true
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      telephone1: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      telephone2: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      telephone3: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      attachmentUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      profile: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdBy_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      modifiedBy_id: {
        type: DataTypes.INTEGER,
        allowNull: false
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

  Buyer.associate = models => {
    models.Buyer.belongsTo(models.User, {
      foreignKey: 'createdBy_id'
    })
    models.Buyer.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id'
    })
    models.Buyer.belongsTo(models.BusinessSource, {
      foreignKey: 'source_id'
    })
    models.Buyer.hasMany(models.EnquiryBusinessBuyer, {
      foreignKey: 'buyer_id'
    })
    models.Buyer.belongsTo(models.BuyerType, { foreignKey: 'typeId' })
  }

  return Buyer
}
