import models from '../../config/sequelize'
import {
  BUYER_MENU,
  BUSINESS_MENU,
  PRESALE_MENU,
  CLIENT_MANAGER_MENU,
  SYSTEM_SETTINGS_MENU
} from '../constants/roles'
import APIError from '../utils/APIError'
import {
  uploadToS3
} from '../modules/aws'

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
  const {
    officeRegisterId
  } = req.params

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
  const {
    buyerMenu,
    businessMenu,
    preSaleMenu,
    clientManagerMenu,
    systemSettingsMenu
  } = req.body

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
  const {
    buyerMenu,
    businessMenu,
    preSaleMenu,
    clientManagerMenu,
    systemSettingsMenu
  } = req.body

  const {
    documentFolderId
  } = req.params

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
  const {
    resourceId
  } = req.params

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

export const listFolders = async (req, res, next) => {
  const {
    officeId
  } = req.params
  try {
    const folders = await models.DocumentFolder.findAll({
      where: {
        officeId: officeId
      }
    })
    return res.status(201).json({
      data: folders
    })
  } catch (error) {
    return next(error)
  }
}

export const uploadFile = async (req, res, next) => {
  const {
    folderId,
    fileName
  } = req.body
  const file = req.files.file

  try {
    // Verify file received
    if (!file) {
      throw new APIError({
        message: 'Expect one file upload named file',
        status: 400,
        isPublic: true
      })
    }

    // Verify file is pdf
    if (!/\/pdf$/.test(file.mimetype)) {
      throw new APIError({
        message: 'Expect pdf file',
        status: 400,
        isPublic: true
      })
    }

    const folder = await models.DocumentFolder.findAll({
      where: {
        id: folderId
      }
    })

    console.log(file.mimetype)

    // Upload file to aws s3
    const upload = await uploadToS3('xcllusive-im', file, `${folder.name}_${fileName}`)

    // // set url in documentFile table
    // await models.DocumentFile.update({
    //   url: upload.Location
    // }, {
    //   where: {
    //     folder_id: folderId
    //   }
    // })
    return res.status(200).json({
      // message: `IM on business BS${business.id} uploaded successfully`
    })
  } catch (error) {
    return next(error)
  }
}
