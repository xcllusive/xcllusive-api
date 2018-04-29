export default (sequelize, DataTypes) => {
  const EnquiryBusinessBuyer = sequelize.define(
    'EnquiryBusinessBuyer',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
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

  EnquiryBusinessBuyer.associate = models => {
    models.EnquiryBusinessBuyer.belongsTo(models.Business, {
      foreignKey: 'business_id'
    })
    models.EnquiryBusinessBuyer.belongsTo(models.Buyer, {
      foreignKey: 'buyer_id'
    })
  }

  return EnquiryBusinessBuyer
}
