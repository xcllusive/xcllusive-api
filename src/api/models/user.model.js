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
      allowNull: false
    },
    agentList: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    createBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    fax: {
      type: DataTypes.STRING,
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idReferrer: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    listAppraisal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    listClosingStage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    listDataGathering: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    listMeeting: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    listSum: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    listYes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    listingNegotiation: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    listingAgent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modifiedBy: {
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
    title: {
      type: DataTypes.STRING,
      allowNull: true
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
    return await bcrypt.compareSync(password, userPassword)
  }

  // User.associate = (models) => {
  //   models.User.hasMany(models.UserType)
  // }

  return User
}
