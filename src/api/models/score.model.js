export default (sequelize, DataTypes) => {
  const Score = sequelize.define(
    'Score',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      currentInterest: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      notesInterest: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      infoTransMomen: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      notesMomentum: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      perceivedPrice: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      notesPrice: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      perceivedRisk: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      notesRisk: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      yours: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      diff: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      avg: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      createdBy_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      modifiedBy_id: {
        type: DataTypes.INTEGER,
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

  Score.associate = models => {
    models.Score.belongsTo(models.User, {
      foreignKey: 'createdBy_id',
      as: 'CreatedBy'
    })
    models.Score.belongsTo(models.User, {
      foreignKey: 'modifiedBy_id',
      as: 'ModifiedBy'
    })
    models.Score.belongsTo(models.Business, {
      foreignKey: 'business_id'
    })
  }

  return Score
}
