export default (sequelize, DataTypes) => {
  const EmailTemplate = sequelize.define(
    'EmailTemplate',
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
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.STRING,
        allowNull: true
      },
      attachmentPath: {
        type: DataTypes.STRING,
        allowNull: true
      },
      enableAttachment: {
        type: DataTypes.BOOLEAN,
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

  EmailTemplate.associate = models => {
    models.Buyer.belongsTo(models.User, {
      foreignKey: 'createdBy_id'
    })
    models.Buyer.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id'
    })
  }

  return EmailTemplate
}
