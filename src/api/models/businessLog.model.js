export default (sequelize, DataTypes) => {
  const BusinessLog = sequelize.define(
    'BusinessLog',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      followUp: {
        type: DataTypes.DATE,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      followUpStatus: {
        type: DataTypes.STRING,
        allowNull: true
      },
      businessRecid: {
        type: DataTypes.INTEGER,
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

  BusinessLog.associate = models => {
    models.BusinessLog.belongsTo(models.User, {
      foreignKey: 'createdBy_id',
      as: 'CreatedBy'
    })
    models.BusinessLog.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id',
      as: 'ModifiedBy'
    })
    models.BusinessLog.belongsTo(models.Business, {
      foreignKey: 'business_id'
    })
  }

  return BusinessLog
}
