import httpStatus from 'http-status'
import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  const { search } = req.query

  try {
    const whereOptions = search && search.length > 1 ?
      {
        where: {
          $or: [
            {
              firstName: {
                $like: `%${search}%`
              },
            },
            {
              lastName: {
                $like: `%${search}%`
              }
            }
          ]
        }
      } : null
    const options = {
      attributes: { exclude: ['password'] }
    }
    const users = await models.User.findAll(Object.assign(options, whereOptions))
    
    res.status(200).json(users)
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    const user = await models.User.create(req.body)
    const userTransformed = user.transform(user)
    return res.status(httpStatus.CREATED).json(userTransformed)
  } catch (err) {
    console.log(err)
    return next(User.checkDuplicateEmail(err))
  }
}

export const update = (req, res, next) => {
  res.status(httpStatus.NO_CONTENT).end()
}

export const remove = (req, res, next) => {
  const { user } = req.locals

  user.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e))
}
