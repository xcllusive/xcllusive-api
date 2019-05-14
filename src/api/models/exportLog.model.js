export default (sequelize, DataTypes) => {
  const ExportLog = sequelize.define(
    'ExportLog', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      exportedPeriodFrom: {
        type: DataTypes.DATE,
        allowNull: true
      },
      exportedPeriodTo: {
        type: DataTypes.DATE,
        allowNull: true
      },
      type: {
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

  ExportLog.associate = models => {
    models.ExportLog.belongsTo(models.User, {
      foreignKey: 'createdBy_id'
    })
  }

  return ExportLog
}
