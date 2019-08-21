export default (sequelize, DataTypes) => {
  const DocumentFile = sequelize.define(
    'DocumentFile', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      name: {
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

  DocumentFile.associate = models => {
    models.DocumentFile.belongsTo(models.User, {
      foreignKey: 'createdBy_id',
      as: 'CreatedBy'
    })
    models.DocumentFile.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id',
      as: 'ModifiedBy'
    })
    models.DocumentFile.belongsTo(models.DocumentFolder, {
      foreignKey: 'folder_id'
    })
  }

  return DocumentFile
}
