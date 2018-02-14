import models from '../../config/sequelize'
import {
  USER_MENU,
  BUSINESS_MENU,
  PRESALE_MENU,
  RESOURCES_MENU,
  CLIENT_MANAGER_MENU,
  SYSTEM_SETTINGS_MENU
} from '../constants/roles'

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
  const {
    userType,
    listingAgent,
    buyerMenu,
    businessMenu,
    preSaleMenu,
    resourcesMenu,
    clientManagerMenu,
    systemSettingsMenu
  } = req.body

  const roles = []

  if (listingAgent === 0) req.body.listingAgent = false
  if (listingAgent === 1) req.body.listingAgent = true
  if (buyerMenu) roles.push(USER_MENU)
  if (businessMenu) roles.push(BUSINESS_MENU)
  if (preSaleMenu) roles.push(PRESALE_MENU)
  if (resourcesMenu) roles.push(RESOURCES_MENU)
  if (clientManagerMenu) roles.push(CLIENT_MANAGER_MENU)
  if (systemSettingsMenu) roles.push(SYSTEM_SETTINGS_MENU)

  req.body.roles = JSON.stringify(roles)
  req.body.createBy = req.user.id
  req.body.userTypeId = userType

  try {
    const { email } = req.body
    const userExists = await models.User.findOne({ attributes: ['email'], where: { email } })
    if (userExists) {
      return res.status(404).json({
        error: 'User exists'
      })
    }
    await models.User.create(req.body)
    return res.status(200).json({ message: 'User created with success' })
  } catch (err) {
    console.log(err)
    return next(err)
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
