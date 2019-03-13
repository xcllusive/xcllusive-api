export default (sequelize, DataTypes) => {
  const SystemSettings = sequelize.define(
    'SystemSettings', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: true
      },
      emailOffice: {
        type: DataTypes.STRING,
        allowNull: true
      },
      emailMarketing: {
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

  SystemSettings.associate = models => {
    models.SystemSettings.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id',
      as: 'ModifiedBy'
    })
  }
  return SystemSettings
}
