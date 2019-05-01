export default (sequelize, DataTypes) => {
  const ControlActivity = sequelize.define(
    'ControlActivity', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      menu: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dateCreated: {
        type: DataTypes.DATE,
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

  ControlActivity.associate = models => {
    models.ControlActivity.belongsTo(models.User, {
      foreignKey: 'userId_logged',
      as: 'userLogged'
    })
  }

  return ControlActivity
}
