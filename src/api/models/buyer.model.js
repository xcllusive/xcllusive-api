export default (sequelize, DataTypes) => {
  const Buyer = sequelize.define(
    'Buyer', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
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
      displayName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
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
      postCode: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      priceFrom: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      priceTo: {
        type: DataTypes.INTEGER,
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
        allowNull: true
      },
      telephone1: {
        type: DataTypes.STRING,
        allowNull: true
      },
      telephone2: {
        type: DataTypes.STRING,
        allowNull: true
      },
      telephone3: {
        type: DataTypes.STRING,
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
      },
      businessType: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      telephone1Number: {
        type: DataTypes.STRING,
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
      foreignKey: 'buyer_id',
      as: 'EnquiryBusinessBuyer'
    })
    models.Buyer.hasMany(models.BuyerLog, {
      foreignKey: 'buyer_id',
      as: 'BuyerLog'
    })
    models.Buyer.belongsTo(models.BuyerType, {
      foreignKey: 'typeId'
    })
    models.Buyer.belongsTo(models.BuyerSource, {
      foreignKey: 'source_id',
      as: 'BuyerSource'
    })
  }

  return Buyer
}
