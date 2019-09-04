export default (sequelize, DataTypes) => {
  const testImportBuyer = sequelize.define(
    'testImportBuyer', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      emailOptional: {
        type: DataTypes.STRING,
        allowNull: true
      },
      telephone1: {
        type: DataTypes.STRING,
        allowNull: true
      },
      telephone2: {
        type: DataTypes.STRING,
        allowNull: true
      },
      telephone3: {
        type: DataTypes.STRING,
        allowNull: true
      },
      source_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      streetName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      suburb: {
        type: DataTypes.STRING,
        allowNull: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true
      },
      postCode: {
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

  return testImportBuyer
}
