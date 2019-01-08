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
      expectedCommission: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      expectedSettlementDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      stage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      textToDo: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
      },
      dateTimeCreatedToDo: {
        type: DataTypes.DATE,
        allowNull: true
      },
      daysOnTheMarket: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      nOfEnquiries: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      nOfEnquiries7Days: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      daysSinceEngaged: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      data120DayGuarantee: {
        type: DataTypes.STRING,
        allowNull: true
      },
      nOfPendingTasks: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      nOfNewLogs7Days: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
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
