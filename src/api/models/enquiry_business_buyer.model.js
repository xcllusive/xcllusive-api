export default (sequelize, DataTypes) => {
  const EnquiryBusinessBuyer = sequelize.define(
    'enquiry_business_buyer',
    {
      buyerID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: true
      },
      businessID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: true
      }
    },
    {
      createdAt: 'dateTimeCreated',
      updatedAt: 'dateTimeModified',
      indexes: [
        {
          unique: true,
          fields: ['buyerID', 'businessID']
        }
      ]
    }
  )

  return EnquiryBusinessBuyer
}
