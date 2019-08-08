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
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      askingPriceOrPropertyValue: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '0'
      },
      commission: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      engagementFee: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '0'
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
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
  }

  return Agreement
}
