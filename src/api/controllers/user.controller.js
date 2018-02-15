import models from '../../config/sequelize'
import {
  BUYER_MENU,
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

  console.log('search: ', search)

  const isAdmin = admin ? JSON.parse(admin) : true
  const isStaff = staff ? JSON.parse(staff) : true
  const isIntroducer = introducer ? JSON.parse(introducer) : true

  const arrayType = []
  if (isAdmin) arrayType.push('Admin')
  if (isStaff) arrayType.push('Staff')
  if (isIntroducer) arrayType.push('Introducer')

  try {
    const whereOptions = search && search.length > 1
      ? {
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
            }
          ],
          userType: arrayType
        }
      }
      : null

    const options = {
      attributes: { exclude: ['password'] },
      where: {
        userType: arrayType
      }
    }
    const users = await models.User.findAll(Object.assign(options, whereOptions))
    return res.status(200).json(users)
  } catch (err) {
    return next(err)
  }
}

export const create = async (req, res, next) => {
  const {
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
  if (buyerMenu) roles.push(BUYER_MENU)
  if (businessMenu) roles.push(BUSINESS_MENU)
  if (preSaleMenu) roles.push(PRESALE_MENU)
  if (resourcesMenu) roles.push(RESOURCES_MENU)
  if (clientManagerMenu) roles.push(CLIENT_MANAGER_MENU)
  if (systemSettingsMenu) roles.push(SYSTEM_SETTINGS_MENU)

  req.body.roles = JSON.stringify(roles)
  req.body.createBy = req.user.id

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
    return next(err)
  }
}

export const update = (req, res, next) => {
  res.status(httpStatus.NO_CONTENT).end()
}

export const remove = async (req, res, next) => {
  const { id } = req.body

  try {
    await models.User.destroy({ where: { id } })
    return res.status(200).json({ message: 'User removed with success' })
  } catch (error) {
    return next(error)
  }
}
