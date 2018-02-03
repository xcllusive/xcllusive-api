import bcrypt from 'bcryptjs'
import httpStatus from 'http-status'
import APIError from '../utils/APIError'

const hashPassword = async (user) => {
  const SALT_FACTOR = 8

  console.log(user)
  console.log(user.password)

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
  }
}

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: false,
        isInt: true,
        notNull: true
      }
    },
    agentList: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    createBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    fax: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    idReferrer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    listAppraisal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    listClosingStage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    listDataGathering: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    listMeeting: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    listSum: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    listYes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    listingNegotiation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    listingAgent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    modifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [4, 128]
      }
    },
    phoneHome: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    phoneMobile: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    phoneWork: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    postCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    street: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    suburb: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    },
    userTypeId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roles: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    createdAt: 'dateTimeCreated',
    updatedAt: 'dateTimeModified',
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
    }
  })

  User.prototype.comparePassword = async (password, userPassword) => {
    console.log('pass: ', password)
    console.log('userPass: ', userPassword)
    return await bcrypt.compareSync(password, userPassword)
  }

  User.associate = (models) => {
    models.User.hasMany(models.UserType)
  }

  return User
}
