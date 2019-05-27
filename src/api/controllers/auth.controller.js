import jwt from 'jsonwebtoken'
import moment from 'moment'
// import moment from 'moment-timezone'

import {
  jwtExpirationInterval,
  jwtSecret
} from '../../config/vars'
import models from '../../config/sequelize'

const jwtSignUser = user => {
  return jwt.sign(user, jwtSecret, {
    expiresIn: `${jwtExpirationInterval} h`
  })
}

export const login = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body
    const user = await models.User.findOne({
      where: {
        email
      }
    })

    if (!user) {
      const err = {
        message: 'The login information was incorrect',
        status: 401,
        isPublic: true
      }
      throw err
    }

    const isPasswordValid = await user.comparePassword(password, user.password)

    if (!isPasswordValid) {
      const err = {
        message: 'The credentials information was incorrect',
        status: 401,
        isPublic: true
      }
      throw err
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      listingAgent: user.listingAgent,
      listingAgentCtc: user.listingAgentCtc
    }

    const newControlActivity = {
      menu: 'Login',
      userId_logged: user.id,
      dateTimeCreated: moment().format('YYYY-MM-DD hh:mm:ss'),
      dateCreated: moment().format('YYYY-MM-DD')
    }
    await models.ControlActivity.create(newControlActivity)

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
      roles: req.user.roles,
      listingAgent: req.user.listingAgent
    }
  })
}

export const logout = async (req, res, next) => {
  const newControlActivity = {
    menu: 'Logout',
    userId_logged: req.body.user.id,
    dateTimeCreated: moment().format('YYYY-MM-DD hh:mm:ss'),
    dateCreated: moment().format('YYYY-MM-DD')
  }
  try {
    await models.ControlActivity.create(newControlActivity)
    return next()
  } catch (error) {
    return next(error)
  }
}
