export default (sequelize, DataTypes) => {
  const Resource = sequelize.define(
    'Resource', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
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

  return Resource
}
