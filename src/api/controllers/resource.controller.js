import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  try {
    const resources = await models.Resource.findAll({
      order: [
        ['title', 'ASC']
      ]
    })
    return res.status(201).json({
      data: resources
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
    title,
    link,
    description
  } = req.body

  try {
    await models.Resource.create({
      title,
      link,
      description
    })

    return res.status(200).json({
      message: `${title} has been created`
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const {
    title,
    link,
    description
  } = req.body

  const {
    resourceId
  } = req.params

  try {
    await models.Resource.update({
      title,
      link,
      description
    }, {
      where: {
        id: resourceId
      }
    })

    return res.status(200).json({
      message: `${title} updated`
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

    return res
      .status(200)
      .json({
        message: `Office register ${resourceId} removed with success`
      })
  } catch (error) {
    return next(error)
  }
}
