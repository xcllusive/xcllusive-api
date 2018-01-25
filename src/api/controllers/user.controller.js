import _ from 'lodash'
import httpStatus from 'http-status'
import { handler as errorHandler } from '../middlewares/error'
import models from '../../config/sequelize'

const User = models.User

export const load = async (req, res, next, id) => {
  try {
    const user = await User.get(id)
    req.locals = { user }
    return next()
  } catch (error) {
    return errorHandler(error, req, res)
  }
}

export const get = (req, res) => res.json(req.locals.user.transform())

export const loggedIn = (req, res) => res.json(req.user.transform())

export const create = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    const userTransformed = user.transform(user)
    return res.status(httpStatus.CREATED).json(userTransformed)
  } catch (err) {
    console.log(err)
    return next(User.checkDuplicateEmail(err))
  }
}

export const replace = async (req, res, next) => {
  try {
    const { user } = req.locals
    const newUser = new User(req.body)
    const ommitRole = user.role !== 'admin' ? 'role' : ''
    const newUserObject = _.omit(newUser.toObject(), '_id', ommitRole)

    await user.update(newUserObject, { override: true, upsert: true })
    const savedUser = await User.findById(user._id)

    res.json(savedUser.transform())
  } catch (error) {
    next(User.checkDuplicateEmail(error))
  }
}

export const update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : ''
  const updatedUser = omit(req.body, ommitRole)
  const user = Object.assign(req.locals.user, updatedUser)

  user.save()
    .then(savedUser => res.json(savedUser.transform()))
    .catch(e => next(User.checkDuplicateEmail(e)))
}

export const list = async (req, res, next) => {
  try {
    const users = await User.findAll()
    const transformedUsers = users.map(user => user.transform(user))
    res.json(transformedUsers)
  } catch (err) {
    next(err)
  }
}

export const remove = (req, res, next) => {
  const { user } = req.locals

  user.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e))
}
