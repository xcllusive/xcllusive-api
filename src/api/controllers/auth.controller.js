import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import moment from 'moment-timezone'
import { jwtExpirationInterval, jwtSecret } from '../../config/vars'
import models from '../../config/sequelize'

const { User } = models

const jwtSignUser = user => jwt.sign(user, jwtSecret, { expiresIn: moment().add(jwtExpirationInterval, 'minutes').unix() })

export const register = async (req, res, next) => {
  try {
    const { email } = req.body
    const userExists = await User.findOne({ where: { email } })
    if (!userExists) {
      return res.status(httpStatus.FORBIDDEN).json({
        error: 'User exists'
      })
    }
    const user = await User.create(req.body)
    const userTransformed = user.transform()
    const token = jwtSignUser(userTransformed)
    return res.status(httpStatus.CREATED).json({ token, user: userTransformed })
  } catch (err) {
    return next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(httpStatus.FORBIDDEN).send({
        error: 'The login information was incorrect'
      })
    }
    const isPasswordValid = await user.comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        error: 'The login information was incorrect'
      })
    }
    const userTransformed = user.transform(user)
    return res.status(httpStatus.OK).send({
      user: userTransformed,
      token: jwtSignUser(userTransformed)
    })
  } catch (err) {
    return next(err)
  }
}

export const refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body
    // const refreshObject = await RefreshToken.findOneAndRemove({
    //   userEmail: email,
    //   token: refreshToken
    // })
    const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject })
    const response = jwtSignUser(user, accessToken)
    return res.json(response)
  } catch (error) {
    return next(error)
  }
}
