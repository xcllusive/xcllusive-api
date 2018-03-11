export default (sequelize, DataTypes) => {
  const BusinessStage = sequelize.define('BusinessStage', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    createdAt: 'dateTimeCreated',
    updatedAt: 'dateTimeModified',
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ]
  })

  return BusinessStage
}
