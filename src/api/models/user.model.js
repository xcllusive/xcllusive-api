import bcrypt from 'bcryptjs'

const hashPassword = async (user) => {
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
  }
}

export default (sequelize, DataTypes) => {
  const roles = ['user', 'admin']

  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 128]
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: roles,
      defaultValue: 'user'
    }
  }, {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword,
      beforeSave: hashPassword
    }
  })

  User.prototype.comparePassword = async (password, userPassword) =>
    bcrypt.compare(password, userPassword)

  User.prototype.transform = (user) => {
    const userJson = user.toJSON()
    delete userJson.password
    return userJson
  }

  return User
}
