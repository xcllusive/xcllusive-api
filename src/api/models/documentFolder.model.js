export default (sequelize, DataTypes) => {
  const DocumentFolder = sequelize.define(
    'DocumentFolder', {
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
      roles: {
        type: DataTypes.STRING,
        allowNull: false
      },
      allOffices: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
  DocumentFolder.associate = models => {
    models.DocumentFolder.belongsTo(models.OfficeRegister, {
      foreignKey: 'officeId',
      as: 'office_id'
    })
    models.DocumentFolder.belongsTo(models.User, {
      foreignKey: 'createdBy_id',
      as: 'CreatedBy'
    })
    models.DocumentFolder.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id',
      as: 'ModifiedBy'
    })
  }

  return DocumentFolder
}
