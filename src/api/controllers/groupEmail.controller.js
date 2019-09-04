import models from '../../config/sequelize'
import APIError from '../utils/APIError'

export const list = async (req, res, next) => {
  try {
    const folders = await models.GroupEmailFolder.findAll({})

    return res.status(201).json({
      data: folders
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
  req.body.createdBy_id = req.user.id

  try {
    const folder = await models.GroupEmailFolder.create(req.body)

    return res.status(200).json({
      message: `${folder.name} has been created`
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const {
    documentFolderId
  } = req.params

  req.body.modifiedBy_id = req.user.id

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

export const createEmailTemplate = async (req, res, next) => {
  const {
    folderId,
    name,
    body
  } = req.body

  const template = {
    name,
    body,
    createdBy_id: req.user.id,
    folder_id: folderId
  }

  try {
    const emailTemplate = await models.GroupEmailTemplate.create(template)

    return res.status(200).json({
      message: `${emailTemplate.name} has been created`
    })
  } catch (error) {
    return next(error)
  }
}

export const listEmailTemplates = async (req, res, next) => {
  const {
    folderId
  } = req.params
  try {
    const templates = await models.GroupEmailTemplate.findAll({
      raw: true,
      where: {
        folder_id: folderId
      },
      order: [
        ['name', 'asc']
      ]
    })
    return res.status(201).json({
      data: templates
    })
  } catch (error) {
    return next(error)
  }
}
