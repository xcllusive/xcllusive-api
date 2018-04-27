import bcrypt from 'bcryptjs'

const hashPassword = async user => {
  const SALT_FACTOR = 8

  if (!user.changed('password')) {
    return
  }

  try {
    const salt = await bcrypt.genSalt(SALT_FACTOR)
    const hash = await bcrypt.hash(user.password, salt, null)
    user.setDataValue('password', hash)
    return
  } catch (err) {
    console.log('Erro ao gerar hash da senha', err)
    return err
  }
}

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      listingAgent: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneHome: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneMobile: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneWork: {
        type: DataTypes.STRING,
        allowNull: true
      },
      postCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true
      },
      street: {
        type: DataTypes.STRING,
        allowNull: true
      },
      suburb: {
        type: DataTypes.STRING,
        allowNull: true
      },
      userType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      roles: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dataRegion: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      createdAt: 'dateTimeCreated',
      updatedAt: 'dateTimeModified',
      hooks: {
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword
      },
      indexes: [
        {
          unique: true,
          fields: ['id', 'email']
        }
      ]
    }
  )

  User.prototype.comparePassword = async (password, userPassword) => {
    const compare = await bcrypt.compareSync(password, userPassword)
    return compare
  }

  User.associate = models => {
    models.User.hasMany(models.Buyer, {
      foreignKey: 'createdBy_id'
    })
    models.User.hasMany(models.Buyer, {
      foreignKey: 'modifiedBy_id'
    })
    models.User.hasMany(models.EmailTemplate, {
      foreignKey: 'createdBy_id'
    })
    models.User.hasMany(models.EmailTemplate, {
      foreignKey: 'modifiedBy_id'
    })
  }

  return User
}
