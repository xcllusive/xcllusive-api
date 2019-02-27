import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  const limit = req.query.limit
  const offset = req.skip

  try {
    const offices = await models.OfficeRegister.findAndCountAll({
      limit,
      offset
    })
    return res.status(201).json({
      data: offices,
      pageCount: offices.count,
      itemCount: Math.ceil(offices.count / req.query.limit)
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
    label,
    address,
    phoneNumber,
    license,
    abn
  } = req.body

  try {
    await models.OfficeRegister.create({
      label,
      address,
      phoneNumber,
      license,
      abn
    })

    return res.status(200).json({
      message: `${label} created`
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const {
    label,
    address,
    phoneNumber,
    license,
    abn
  } = req.body

  const {
    officeRegisterId
  } = req.params

  try {
    await models.OfficeRegister.update({
      label,
      address,
      phoneNumber,
      license,
      abn
    }, {
      where: {
        id: officeRegisterId
      }
    })

    return res.status(200).json({
      message: `${label} updated`
    })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const {
    officeRegisterId
  } = req.params

  try {
    await models.OfficeRegister.destroy({
      where: {
        id: officeRegisterId
      }
    })

    return res
      .status(200)
      .json({
        message: `Office register ${officeRegisterId} removed with success`
      })
  } catch (error) {
    return next(error)
  }
}
