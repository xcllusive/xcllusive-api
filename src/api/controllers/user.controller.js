import models from '../../config/sequelize'

import {
  BUYER_MENU,
  BUSINESS_MENU,
  PRESALE_MENU,
  TOOLS_AND_DOCS_MENU,
  CLIENT_MANAGER_MENU,
  MANAGEMENT_MENU,
  SYSTEM_SETTINGS_MENU,
  CTC_MENU
} from '../constants/roles'

export const getLogged = async (req, res, next) => {
  const {
    id
  } = req.query
  try {
    let userLogged = {}

    if (id > 0) {
      userLogged = await models.User.findOne({
        where: {
          id: id
        }
      })
    } else {
      userLogged = await models.User.findOne({
        where: {
          id: req.user.id
        }
      })
    }

    return res.status(201).json({
      data: userLogged
    })
  } catch (error) {
    return next(error)
  }
}

export const list = async (req, res, next) => {
  const {
    search,
    admin,
    broker,
    introducer
  } = req.query

  const isAdmin = admin ? JSON.parse(admin) : true
  const isBroker = broker ? JSON.parse(broker) : true
  const isIntroducer = introducer ? JSON.parse(introducer) : true

  const arrayType = []
  isAdmin && arrayType.push('Admin')
  isBroker && arrayType.push('Broker')
  isIntroducer && arrayType.push('Introducer')

  try {
    const whereOptions =
      search && search.length > 1 ? ({
        where: {
          $or: [{
            firstName: {
              $like: `%${search}%`
            }
          }, {
            lastName: {
              $like: `%${search}%`
            }
          }, {
            role: {
              $like: `%${search}%`
            }
          }],
          userType: arrayType
        }
      }) : null

    const options = {
      attributes: {
        exclude: ['password']
      },
      where: {
        userType: arrayType
      },
      order: [
        [
          'active', 'DESC'
        ], ['firstName', 'ASC']
      ]
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
    toolsAndDocsMenu,
    clientManagerMenu,
    managementMenu,
    systemSettingsMenu,
    ctcMenu
  } = req.body

  const roles = []

  if (listingAgent === 0) req.body.listingAgent = false
  if (listingAgent === 1) req.body.listingAgent = true
  if (buyerMenu) roles.push(BUYER_MENU)
  if (businessMenu) roles.push(BUSINESS_MENU)
  if (preSaleMenu) roles.push(PRESALE_MENU)
  if (toolsAndDocsMenu) roles.push(TOOLS_AND_DOCS_MENU)
  if (clientManagerMenu) roles.push(CLIENT_MANAGER_MENU)
  if (managementMenu) roles.push(MANAGEMENT_MENU)
  if (systemSettingsMenu) roles.push(SYSTEM_SETTINGS_MENU)
  if (ctcMenu) roles.push(CTC_MENU)

  req.body.roles = JSON.stringify(roles)
  req.body.createBy = req.user.id

  try {
    const {
      email,
      officeId
    } = req.body
    const userExists = await models.User.findOne({
      attributes: ['email'],
      where: {
        email
      }
    })
    if (userExists) {
      const err = {
        message: 'User already exists',
        status: 400,
        isPublic: true
      }
      throw err
    }

    const regionlabel = await models.OfficeRegister.findOne({
      raw: true,
      attributes: ['label'],
      where: {
        id: officeId
      }
    })
    req.body.dataRegion = regionlabel.label

    const newUser = await models.User.create(req.body)
    return res.status(200).json({
      data: newUser,
      message: 'User created with success'
    })
  } catch (err) {
    return next(err)
  }
}

export const update = async (req, res, next) => {
  const {
    listingAgent,
    buyerMenu,
    password,
    levelOfInfoAccess,
    businessMenu,
    preSaleMenu,
    toolsAndDocsMenu,
    clientManagerMenu,
    managementMenu,
    systemSettingsMenu,
    ctcMenu
  } = req.body

  const roles = []

  if (listingAgent === 0) req.body.listingAgent = false
  if (listingAgent === 1) req.body.listingAgent = true
  if (levelOfInfoAccess === 0) req.body.levelOfInfoAccess = false
  if (levelOfInfoAccess === 1) req.body.levelOfInfoAccess = true
  if (buyerMenu) roles.push(BUYER_MENU)
  if (businessMenu) roles.push(BUSINESS_MENU)
  if (preSaleMenu) roles.push(PRESALE_MENU)
  if (toolsAndDocsMenu) roles.push(TOOLS_AND_DOCS_MENU)
  if (clientManagerMenu) roles.push(CLIENT_MANAGER_MENU)
  if (managementMenu) roles.push(MANAGEMENT_MENU)
  if (systemSettingsMenu) roles.push(SYSTEM_SETTINGS_MENU)
  if (ctcMenu) roles.push(CTC_MENU)

  req.body.roles = JSON.stringify(roles)
  req.body.createBy = req.user.id

  if (!password) delete req.body.password

  try {
    await models.User.update(req.body, {
      where: {
        id: req.body.id
      }
    })
    return res
      .status(200)
      .json({
        message: `User ${req.body.firstName} updated with success`
      })
  } catch (err) {
    return next(err)
  }
}

export const activeInactive = async (req, res, next) => {
  const user = req.body

  let activeInactive = null
  if (user.active) {
    user.active = false
    activeInactive = 'Inactive'
  } else {
    user.active = true
    activeInactive = 'Active'
  }

  try {
    await models.User.update(user, {
      where: {
        id: user.id
      }
    })
    return res
      .status(200)
      .json({
        message: `User ${req.body.firstName} is now ${activeInactive}`
      })
  } catch (err) {
    return next(err)
  }
}

export const remove = async (req, res, next) => {
  const {
    id
  } = req.body

  try {
    await models.User.destroy({
      where: {
        id
      }
    })
    return res.status(200).json({
      message: 'User removed with success'
    })
  } catch (error) {
    return next(error)
  }
}
