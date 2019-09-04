export default (sequelize, DataTypes) => {
  const testImportBusiness = sequelize.define(
    'testImportBusiness', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      businessName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      businessAddress: {
        type: DataTypes.STRING,
        allowNull: true
      },
      vendorPhone1: {
        type: DataTypes.STRING,
        allowNull: true
      },
      vendorEmail: {
        type: DataTypes.STRING,
        allowNull: true
      },
      stageId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      listedPrice: {
        type: DataTypes.STRING,
        allowNull: true
      },
      businessCategories: {
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

  return testImportBusiness
}
