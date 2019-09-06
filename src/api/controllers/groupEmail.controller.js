import models from '../../config/sequelize'
import APIError from '../utils/APIError'
import _ from 'lodash'

export const list = async (req, res, next) => {
  try {
    const folders = await models.GroupEmailFolder.findAll({})

    const folderAnalysts = _.filter(folders,
      obj => obj !== null && obj.subFolder === 'Analysts'

    )
    const folderBrokers = _.filter(folders,
      obj => obj !== null && obj.subFolder === 'Brokers'
    )
    const folderGeneral = _.filter(folders,
      obj => obj !== null && obj.subFolder === 'General'
    )

    return res.status(201).json({
      data: folders,
      folderAnalysts,
      folderBrokers,
      folderGeneral
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
  req.body.modifiedBy_id = req.user.id

  try {
    await models.GroupEmailFolder.update(req.body, {
      where: {
        id: req.body.id
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
    id,
    name
  } = req.body

  try {
    const folder = await models.GroupEmailTemplate.findOne({
      where: {
        folder_id: id
      }
    })

    if (!folder) {
      await models.GroupEmailFolder.destroy({
        where: {
          id: id
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
      message: `Folder ${name} removed with success`
    })
  } catch (error) {
    return next(error)
  }
}

export const createEmailTemplate = async (req, res, next) => {
  const {
    folderId,
    name,
    body,
    subject
  } = req.body

  const template = {
    name,
    body,
    createdBy_id: req.user.id,
    subject,
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

export const updateEmailTemplate = async (req, res, next) => {
  req.body.modifiedBy_id = req.user.id

  try {
    await models.GroupEmailTemplate.update(req.body, {
      where: {
        id: req.body.id
      }
    })

    return res.status(200).json({
      message: `${req.body.name} updated`
    })
  } catch (error) {
    return next(error)
  }
}

export const removeEmailTemplate = async (req, res, next) => {
  const {
    id,
    name
  } = req.body

  try {
    await models.GroupEmailTemplate.destroy({
      where: {
        id: id
      }
    })

    return res.status(200).json({
      message: `Template ${name} removed with success`
    })
  } catch (error) {
    return next(error)
  }
}
