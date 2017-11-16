import models from '../../config/sequelize'
import APIError from '../utils/APIError'

const httpStatus = require('http-status')
const jwt = require('jsonwebtoken')
const RefreshToken = require('../models/refreshToken.model')
const moment = require('moment-timezone')
const { jwtExpirationInterval, jwtSecret } = require('../../config/vars')

const User = models.users

const checkDuplicateEmail = (err) => {
  if (err.original.code === 'ER_DUP_ENTRY') {
    return new APIError({
      message: 'Validation Error',
      errors: [{
        field: 'email',
        location: 'body',
        messages: ['"email" already exists']
      }],
      status: httpStatus.CONFLICT,
      isPublic: true
    })
  }
  return err
}

const jwtSignUser = user => jwt.sign(user, jwtSecret, { expiresIn: moment().add(jwtExpirationInterval, 'minutes').unix() })

export const register = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    const userTransformed = user.transform()
    const token = jwtSignUser(userTransformed)
    return res.status(httpStatus.CREATED).json({ token, user: userTransformed })
  } catch (error) {
    return next(checkDuplicateEmail(error))
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(httpStatus.FORBIDDEN).json({
        error: 'The login information was incorrect'
      })
    }
    const isPasswordValid = await user.comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(403).send({
        error: 'The login information was incorrect'
      })
    }
    const userTransformed = user.transform(user)
    res.send({
      user: userTransformed,
      token: jwtSignUser(userTransformed)
    })
  } catch (err) {
    return next(err)
  }
  return next()
}

export const refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken
    })
    const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject })
    const response = jwtSignUser(user, accessToken)
    return res.json(response)
  } catch (error) {
    return next(error)
  }
}
