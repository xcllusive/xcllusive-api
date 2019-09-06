export default (sequelize, DataTypes) => {
  const GroupEmailFolder = sequelize.define(
    'GroupEmailFolder', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subFolder: {
        type: DataTypes.STRING,
        allowNull: false
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
  GroupEmailFolder.associate = models => {
    models.GroupEmailFolder.belongsTo(models.User, {
      foreignKey: 'createdBy_id',
      as: 'CreatedBy'
    })
    models.GroupEmailFolder.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id',
      as: 'ModifiedBy'
    })
  }

  return GroupEmailFolder
}
