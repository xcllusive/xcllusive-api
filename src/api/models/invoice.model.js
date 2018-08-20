export default (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    'Invoice',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      ref: {
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
      to: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      dateSent: {
        type: DataTypes.DATE,
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
  Invoice.associate = models => {
    models.Invoice.belongsTo(models.User, {
      foreignKey: 'createdBy_id',
      as: 'CreatedBy'
    })
    models.Invoice.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id',
      as: 'ModifiedBy'
    })
    models.Invoice.belongsTo(models.Business, {
      foreignKey: 'business_id',
      as: 'Business'
    })
  }

  return Invoice
}
