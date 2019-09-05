export default (sequelize, DataTypes) => {
  const GroupEmailTemplate = sequelize.define(
    'GroupEmailTemplate', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      subject: {
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

  GroupEmailTemplate.associate = models => {
    models.GroupEmailTemplate.belongsTo(models.User, {
      foreignKey: 'createdBy_id',
      as: 'CreatedBy'
    })
    models.GroupEmailTemplate.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id',
      as: 'ModifiedBy'
    })
    models.GroupEmailTemplate.belongsTo(models.GroupEmailFolder, {
      foreignKey: 'folder_id'
    })
  }

  return GroupEmailTemplate
}
