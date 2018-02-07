import httpStatus from 'http-status'
import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  const {
    search,
    admin,
    staff,
    introducer
  } = req.query

  const isAdmin = admin ? JSON.parse(admin) : true
  const isStaff = staff ? JSON.parse(staff) : true
  const isIntroducer = introducer ? JSON.parse(introducer) : true

  try {
    const whereOptions = search && search.length > 1 ?
      {
        where: {
          $or: [
            {
              firstName: {
                $like: `%${search}%`
              }
            },
            {
              lastName: {
                $like: `%${search}%`
              }
            },
            {
              userTypeId: {
                $eq: 0
              }
            }
          ]
        }
      } : null
    const arrayTypeId = []
    if (isAdmin) arrayTypeId.push(1)
    if (isStaff) arrayTypeId.push(2)
    if (isIntroducer) arrayTypeId.push(3)
    const options = {
      attributes: { exclude: ['password'] },
      where: {
        $or: [
          {
            userTypeId: arrayTypeId
          }
        ]
      }
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
