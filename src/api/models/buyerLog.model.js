export default (sequelize, DataTypes) => {
  const BuyerLog = sequelize.define(
    'BuyerLog',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      text: {
        type: DataTypes.STRING,
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
          fields: ['id']
        }
      ]
    }
  )

  BuyerLog.associate = models => {
    models.BuyerLog.belongsTo(models.User, {
      foreignKey: 'createdBy_id'
    })
    models.BuyerLog.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id'
    })
    models.BuyerLog.belongsTo(models.Buyer, {
      foreignKey: 'buyer_id'
    })
    models.BuyerLog.belongsTo(models.Business, {
      foreignKey: 'business_id'
    })
  }

  return BuyerLog
}
