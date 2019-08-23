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
      accessListingAgentXcllusive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      accessListingAgentCtc: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      accessLevelOfInfo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
  }

  return DocumentFolder
}
