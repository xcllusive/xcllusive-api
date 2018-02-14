import jwt from 'jsonwebtoken'
import moment from 'moment-timezone'

import { jwtExpirationInterval, jwtSecret } from '../../config/vars'
import models from '../../config/sequelize'

const jwtSignUser = (user) => {
  return jwt.sign(user, jwtSecret, {
    expiresIn: moment().add(jwtExpirationInterval, 'minutes').unix()
  })
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await models.User.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({
        error: 'The login information was incorrect'
      })
    }

    const isPasswordValid = await user.comparePassword(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'The credentials information was incorrect'
      })
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      roles: user.roles
    }

    return res.status(200).json({
      user: userResponse,
      accessToken: jwtSignUser(userResponse)
    })
  } catch (err) {
    return next(err)
  }
}

export const loginWithToken = async (req, res, next) => {
  return res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
      roles: req.user.roles
    }
  })
}
