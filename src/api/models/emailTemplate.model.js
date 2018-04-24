export default (sequelize, DataTypes) => {
  const EmailTemplate = sequelize.define(
    'EmailTemplate',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: true
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
        type: DataTypes.INTEGER,
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

  return EmailTemplate
}
