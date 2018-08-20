export default (sequelize, DataTypes) => {
  const InvoiceTemplate = sequelize.define(
    'InvoiceTemplate',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false
      },
      officeDetails: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      bankDetails: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      paymentTerms: {
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

  InvoiceTemplate.associate = models => {
    models.InvoiceTemplate.belongsTo(models.User, {
      foreignKey: 'createdBy_id',
      as: 'CreatedBy'
    })
    models.InvoiceTemplate.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id',
      as: 'ModifiedBy'
    })
  }

  return InvoiceTemplate
}
