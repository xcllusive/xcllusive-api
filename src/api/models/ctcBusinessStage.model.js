export default (sequelize, DataTypes) => {
  const CtcBusinessStage = sequelize.define(
    'CtcBusinessStage', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: true
      },
      label: {
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

  return CtcBusinessStage
}
