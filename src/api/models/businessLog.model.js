export default (sequelize, DataTypes) => {
  const BusinessLog = sequelize.define('BusinessLog', {
    id: {
      type: DataTypes.INTEGER,      
      primaryKey: true,
      unique: true,
      allowNull: true
    },
    creationTimeStamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.DATE,
      allowNull: true
    },
    modificationTimeStamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    followUp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    followUpStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessRecid: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    createdAt: 'dateTimeCreated',
    updatedAt: 'dateTimeModified',
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ]
  })

  return BusinessLog
}