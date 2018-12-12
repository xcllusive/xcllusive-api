export default (sequelize, DataTypes) => {
  const BrokerWeeklyReport = sequelize.define(
    'BrokerWeeklyReport',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
      },
      expectedPrice: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      expectedSettlementDate: {
        type: DataTypes.DATE,
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

  BrokerWeeklyReport.associate = models => {
    models.BrokerWeeklyReport.belongsTo(models.User, {
      foreignKey: 'createdBy_id',
      as: 'CreatedBy'
    })
    models.BrokerWeeklyReport.belongsTo(models.Business, {
      foreignKey: 'business_id'
    })
  }

  return BrokerWeeklyReport
}
