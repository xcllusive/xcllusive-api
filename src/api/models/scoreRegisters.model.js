export default (sequelize, DataTypes) => {
  const ScoreRegisters = sequelize.define(
    'ScoreRegisters',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      label: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      createdAt: 'dateTimeCreated',
      updatedAt: 'dateTimeModified',
      indexes: [
        {
          unique: true,
          fields: ['id']
        }
      ]
    }
  )

  return ScoreRegisters
}
