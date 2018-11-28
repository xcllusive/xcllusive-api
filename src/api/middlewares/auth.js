import jwt from 'jsonwebtoken'
import { intersection } from 'lodash'
import APIError from '../utils/APIError'
import { jwtSecret } from '../../config/vars'
import { IGNORE_ROUTES } from '../constants/roles'

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info
  const logIn = Promise.promisify(req.logIn)
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: 401,
    stack: error ? error.stack : undefined
  })

  try {
    if (error || !user) throw error
    await logIn(user, { session: false })
  } catch (e) {
    return next(apiError)
  }

  if (roles === LOGGED_USER) {
    if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
      apiError.status = 401
      apiError.message = 'Forbidden'
      return next(apiError)
    }
  } else if (!roles.includes(user.role)) {
    apiError.status = 401
    apiError.message = 'Forbidden'
    return next(apiError)
  } else if (err || !user) {
    return next(apiError)
  }

  req.user = user

  return next()
}

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).send({ message: 'No token provided' })
  }

  const parts = authHeader.split(' ')

  if (!parts.length === 2) {
    return res.status(401).send({ message: 'Token error' })
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ message: 'Token malformatted' })
  }

  return jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Token invalid' })

    req.user = decoded
    return next()
  })
}

export const authorizeMiddleware = settings => {
  const { roles } = settings

  return (req, res, next) => {
    const { user } = req

    if (!user) {
      return res.status(403).send({ message: 'Not Authorized' })
    }

    if (IGNORE_ROUTES.includes(req.originalUrl)) {
      return next()
    }

    if (roles && roles.length > 0) {
      const tokenRoles = JSON.parse(req.user.roles)
      if (!intersection(roles, tokenRoles).length > 0) {
        return res.status(403).send({ message: 'Not Authorized' })
      }
    }

    return next()
  }
}
