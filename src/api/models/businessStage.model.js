export default (sequelize, DataTypes) => {
  const BusinessStage = sequelize.define('BusinessStage', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: true
    },
<<<<<<< HEAD
    label: {
=======
    name: {
>>>>>>> de31c1243440db503d6e78f98465e2cd8ad5e58f
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
