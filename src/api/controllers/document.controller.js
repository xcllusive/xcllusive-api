import models from '../../config/sequelize'
import { BUYER_MENU, BUSINESS_MENU, PRESALE_MENU, CLIENT_MANAGER_MENU, SYSTEM_SETTINGS_MENU } from '../constants/roles'

export const list = async (req, res, next) => {
  try {
    const folder = await models.DocumentFolder.findAll({})
    return res.status(201).json({
      data: folder
    })
  } catch (error) {
    return next(error)
  }
}

export const get = async (req, res, next) => {
  const { officeRegisterId } = req.params

  try {
    const office = await models.OfficeRegister.findOne({
      where: {
        id: officeRegisterId
      }
    })
    return res.status(201).json({
      data: office
    })
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const { buyerMenu, businessMenu, preSaleMenu, clientManagerMenu, systemSettingsMenu } = req.body

  const roles = []
  if (buyerMenu) roles.push(BUYER_MENU)
  if (businessMenu) roles.push(BUSINESS_MENU)
  if (preSaleMenu) roles.push(PRESALE_MENU)
  if (clientManagerMenu) roles.push(CLIENT_MANAGER_MENU)
  if (systemSettingsMenu) roles.push(SYSTEM_SETTINGS_MENU)

  req.body.roles = JSON.stringify(roles)
  req.body.createBy = req.user.id

  try {
    const folder = await models.DocumentFolder.create(req.body)

    return res.status(200).json({
      message: `${folder.name} has been created`
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { buyerMenu, businessMenu, preSaleMenu, clientManagerMenu, systemSettingsMenu } = req.body

  const { documentFolderId } = req.params

  const roles = []
  if (buyerMenu) roles.push(BUYER_MENU)
  if (businessMenu) roles.push(BUSINESS_MENU)
  if (preSaleMenu) roles.push(PRESALE_MENU)
  if (clientManagerMenu) roles.push(CLIENT_MANAGER_MENU)
  if (systemSettingsMenu) roles.push(SYSTEM_SETTINGS_MENU)

  try {
    await models.DocumentFolder.update(req.body, {
      where: {
        id: documentFolderId
      }
    })

    return res.status(200).json({
      message: `${req.body.name} updated`
    })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const { resourceId } = req.params

  try {
    await models.Resource.destroy({
      where: {
        id: resourceId
      }
    })

    return res.status(200).json({
      message: `Office register ${resourceId} removed with success`
    })
  } catch (error) {
    return next(error)
  }
}
