export default (sequelize, DataTypes) => {
  const BuyerLog = sequelize.define(
    'BuyerLog',
    {
      buyerID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
      },
      businessID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdByID: {
        type: DataTypes.DATE,
        allowNull: true
      },
      modifiedByID: {
        type: DataTypes.DATE,
        allowNull: true
      },
      followUp: {
        type: DataTypes.DATE,
        allowNull: true
      },
      followUpStatus: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      createdAt: 'dateTimeCreated',
      updatedAt: 'dateTimeModified',
      indexes: [
        {
          unique: true,
          fields: ['buyerID', 'businessID']
        }
      ]
    }
  )

  BuyerLog.associate = models => {
    models.BuyerLog.belongsTo(models.Buyer, {
      foreignKey: 'buyer_id'
    })
    models.BuyerLog.belongsTo(models.Buyer, {
      foreignKey: 'business_id'
    })
  }

  return BuyerLog
}
