export default (sequelize, DataTypes) => {
  const EmailTemplate = sequelize.define(
    'AgreementTemplate',
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
      header: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.STRING,
        allowNull: true
      },
      footer: {
        type: DataTypes.STRING,
        allowNull: false
      },
      handlebars: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '[]'
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
