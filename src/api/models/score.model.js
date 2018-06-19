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
      currentInterest_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      notesInterest: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      infoTransMomen_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      notesMomentum: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      perceivedPrice_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      notesPrice: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      perceivedRisk_id: {
        type: DataTypes.INTEGER,
        allowNull: false
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
      dateSent: {
        type: DataTypes.DATE,
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
    models.Score.belongsTo(models.ScoreRegister, {
      foreignKey: 'currentInterest_id',
      as: 'currentInterest'
    })
    models.Score.belongsTo(models.ScoreRegister, {
      foreignKey: 'infoTransMomen_id',
      as: 'infoTransMomen'
    })
    models.Score.belongsTo(models.ScoreRegister, {
      foreignKey: 'perceivedPrice_id',
      as: 'perceivedPrice'
    })
    models.Score.belongsTo(models.ScoreRegister, {
      foreignKey: 'perceivedRisk_id',
      as: 'perceivedRisk'
    })
  }

  return Score
}
