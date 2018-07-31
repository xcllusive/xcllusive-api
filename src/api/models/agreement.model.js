export default (sequelize, DataTypes) => {
  const Agreement = sequelize.define(
    'Agreement',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      body: {
        type: DataTypes.TEXT,
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

  Agreement.associate = models => {
    models.Agreement.belongsTo(models.User, {
      foreignKey: 'createdBy_id',
      as: 'CreatedBy'
    })
    models.Agreement.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id',
      as: 'ModifiedBy'
    })
    models.Agreement.belongsTo(models.Business, {
      foreignKey: 'business_id',
      as: 'Business'
    })
  }

  return Agreement
}
