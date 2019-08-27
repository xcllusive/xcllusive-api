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
  uploadToS3,
  deleteObjectS3
} from '../modules/aws'

export const list = async (req, res, next) => {
  try {
    const user = await models.User.findOne({
      raw: true,
      where: {
        id: req.user.id
      }
    })

    const offices = await models.OfficeRegister.findAll({
      raw: true,
      attributes: ['id', 'label'],
      where: {
        id: {
          $ne: 3
        }
      },
      order: [
        ['id', 'ASC']
      ]
    })

    const folderPerOffice = await Promise.all(
      offices.map(async item => {
        const folder = await models.DocumentFolder.findAll({
          raw: true,
          attributes: ['id', 'name', 'roles', 'accessListingAgentXcllusive', 'accessListingAgentCtc', 'accessLevelOfInfo', 'allOffices'],
          where: {
            officeId: item.id,
            accessListingAgentXcllusive: user.listingAgent,
            accessListingAgentCTC: user.listingAgentCtc,
            accessLevelOfInfo: user.levelOfInfoAccess
          },
          include: [{
            model: models.OfficeRegister,
            attributes: ['label'],
            as: 'office_id',
            where: {
              id: {
                $col: 'DocumentFolder.officeId'
              }
            }
          }]
        })
        const folderWithAccess = folder.map(item => {
          let findRole = false
          JSON.parse(user.roles).forEach(roles => {
            if (JSON.parse(item.roles).includes(roles)) {
              findRole = true
            }
          })
          return findRole ? item : null
        })

        return folderWithAccess.length > 0 ? folderWithAccess : null
      })
    )

    const folderAllOffices = await models.DocumentFolder.findAll({
      raw: true,
      attributes: ['id', 'name', 'roles', 'accessListingAgentXcllusive', 'accessListingAgentCtc', 'accessLevelOfInfo', 'allOffices'],
      where: {
        allOffices: true,
        accessListingAgentXcllusive: user.listingAgent,
        accessListingAgentCTC: user.listingAgentCtc,
        accessLevelOfInfo: user.levelOfInfoAccess
      }
    })
    const folderAllOfficesWithAccess = folderAllOffices.map(item => {
      let findRole = false
      JSON.parse(user.roles).forEach(roles => {
        if (JSON.parse(item.roles).includes(roles)) {
          findRole = true
        }
      })
      return findRole ? item : null
    })

    return res.status(201).json({
      data: folderPerOffice,
      folderAllOfficesWithAccess
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
    documentFolderId
  } = req.params

  try {
    const folder = await models.DocumentFile.findOne({
      where: {
        folder_id: documentFolderId
      }
    })

    if (!folder) {
      await models.DocumentFolder.destroy({
        where: {
          id: documentFolderId
        }
      })
    } else {
      throw new APIError({
        message: 'This folder can not be deleted because it has files inside.',
        status: 400,
        isPublic: true
      })
    }

    return res.status(200).json({
      message: `Folder ${documentFolderId} removed with success`
    })
  } catch (error) {
    return next(error)
  }
}

export const listFolders = async (req, res, next) => {
  const {
    officeId
  } = req.params

  let whereOptions = {
    officeId: officeId
  }

  if (!JSON.parse(officeId)) {
    whereOptions = {
      allOffices: true
    }
  }

  try {
    const folders = await models.DocumentFolder.findAll({
      where: whereOptions
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

    const folder = await models.DocumentFolder.findOne({
      raw: true,
      where: {
        id: folderId
      }
    })

    let office = {}
    if (folder.officeId) {
      office = await models.OfficeRegister.findOne({
        raw: true,
        where: {
          id: folder.officeId
        }
      })
    } else {
      office.label = 'All Offices'
    }
    const sizeString = file.mimetype.length
    const sizeFormat = file.mimetype.indexOf('/')
    const format = file.mimetype.substr(sizeFormat + 1, sizeString)
    const fileNameAWS = `${office.label.replace(' ', '')}_${folder.name.replace(' ', '')}_${fileName.replace(' ', '')}`

    // Upload file to aws s3
    const upload = await uploadToS3('xcllusive-documents', file, `${fileNameAWS}.${format}`)
    // set url in documentFile table
    await models.DocumentFile.create({
      url: upload.Location,
      name: fileName,
      key: `${fileNameAWS}.${format}`,
      createdBy_id: req.user.id,
      modifiedBy_id: req.user.id,
      folder_id: folderId
    }, {
      where: {
        folder_id: folderId
      }
    })
    return res.status(200).json({
      message: `${fileName} uploaded successfully`
    })
  } catch (error) {
    return next(error)
  }
}

export const listFiles = async (req, res, next) => {
  const {
    folderId
  } = req.params
  try {
    const files = await models.DocumentFile.findAll({
      raw: true,
      where: {
        folder_id: folderId
      }
    })
    return res.status(201).json({
      data: files
    })
  } catch (error) {
    return next(error)
  }
}

export const removeFile = async (req, res, next) => {
  const {
    documentFileId
  } = req.params

  try {
    const file = await models.DocumentFile.findOne({
      where: {
        id: documentFileId
      }
    })

    await deleteObjectS3('xcllusive-documents', file.key)

    await models.DocumentFile.destroy({
      where: {
        id: documentFileId
      }
    })

    return res.status(200).json({
      message: `File ${documentFileId} removed with success`
    })
  } catch (error) {
    return next(error)
  }
}
