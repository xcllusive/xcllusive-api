import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  const { businessRegister } = req.params

  const limit = req.query.limit
  const offset = req.skip

  try {
    switch (parseInt(businessRegister, 10)) {
      case 1:
        const registers1 = await models.BusinessSource.findAndCountAll({ limit, offset })
        return res.status(201).json({
          data: registers1,
          pageCount: registers1.count,
          itemCount: Math.ceil(registers1.count / req.query.limit)
        })
      case 2:
        const registers2 = await models.BusinessRating.findAndCountAll({ limit, offset })
        return res.status(201).json({
          data: registers2,
          pageCount: registers2.count,
          itemCount: Math.ceil(registers2.count / req.query.limit)
        })
      case 3:
        const registers3 = await models.BusinessProduct.findAndCountAll({ limit, offset })
        return res.status(201).json({
          data: registers3,
          pageCount: registers3.count,
          itemCount: Math.ceil(registers3.count / req.query.limit)
        })
      case 4:
        const registers4 = await models.BusinessIndustry.findAndCountAll({
          limit,
          offset
        })
        return res.status(201).json({
          data: registers4,
          pageCount: registers4.count,
          itemCount: Math.ceil(registers4.count / req.query.limit)
        })
      case 5:
        const registers5 = await models.BusinessType.findAndCountAll({ limit, offset })
        return res.status(201).json({
          data: registers5,
          pageCount: registers5.count,
          itemCount: Math.ceil(registers5.count / req.query.limit)
        })
      case 6:
        const registers6 = await models.BusinessOwnersTime.findAndCountAll({
          limit,
          offset
        })
        return res.status(201).json({
          data: registers6,
          pageCount: registers6.count,
          itemCount: Math.ceil(registers6.count / req.query.limit)
        })
      case 7:
        const registers7 = await models.BusinessStage.findAndCountAll({ limit, offset })
        return res.status(201).json({
          data: registers7,
          pageCount: registers7.count,
          itemCount: Math.ceil(registers7.count / req.query.limit)
        })
      default:
        throw new Error(`Business register ${businessRegister} does not exist`)
    }
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const { label, businessRegister } = req.body

  try {
    if (businessRegister === 1) {
      await models.BusinessSource.create({ label })
    }
    if (businessRegister === 2) {
      await models.BusinessRating.create({ label })
    }
    if (businessRegister === 3) {
      await models.BusinessProduct.create({ label })
    }
    if (businessRegister === 4) {
      await models.BusinessIndustry.create({ label })
    }
    if (businessRegister === 5) {
      await models.BusinessType.create({ label })
    }
    if (businessRegister === 6) {
      await models.BusinessOwnersTime.create({ label })
    }
    if (businessRegister === 7) {
      await models.BusinessStage.create({ label })
    }
    if (!businessRegister) {
      throw new Error(`Business register ${businessRegister} does not exist`)
    }

    return res.status(200).json({ message: `Business register ${label} created` })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { label, businessRegisterType } = req.body

  const { businessRegister: id } = req.params

  try {
    if (businessRegisterType === 1) {
      await models.BusinessSource.update({ label }, { where: { id } })
    }
    if (businessRegisterType === 2) {
      await models.BusinessRating.update({ label }, { where: { id } })
    }
    if (businessRegisterType === 3) {
      await models.BusinessProduct.update({ label }, { where: { id } })
    }
    if (businessRegisterType === 4) {
      await models.BusinessIndustry.update({ label }, { where: { id } })
    }
    if (businessRegisterType === 5) {
      await models.BusinessType.update({ label }, { where: { id } })
    }
    if (businessRegisterType === 6) {
      await models.BusinessOwnersTime.update({ label }, { where: { id } })
    }
    if (businessRegisterType === 7) {
      await models.BusinessStage.update({ label }, { where: { id } })
    }
    if (!businessRegisterType) {
      throw new Error('Business register type does not exist')
    }

    return res.status(200).json({ message: `Business register ${label} updated` })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const { registerType } = req.body

  const { businessRegister: id } = req.params

  try {
    const existsRegisterType = await models.Business.findAll({
      raw: true,
      attributes: ['id', 'sourceId'],
      where: {
        sourceId: id
      }
    })
    console.log(existsRegisterType)
    if (existsRegisterType.length > 0) {
      return res.status(406).json({
        error: `You can NOT delete that! Business register ${id} has been using in one or more businesses`
      })
    }
    if (registerType === 1) {
      await models.BusinessSource.destroy({ where: { id } })
    }
    if (registerType === 2) {
      await models.BusinessRating.destroy({ where: { id } })
    }
    if (registerType === 3) {
      await models.BusinessProduct.destroy({ where: { id } })
    }
    if (registerType === 4) {
      await models.BusinessIndustry.destroy({ where: { id } })
    }
    if (registerType === 5) {
      await models.BusinessType.destroy({ where: { id } })
    }
    if (registerType === 6) {
      await models.BusinessOwnersTime.destroy({ where: { id } })
    }
    if (registerType === 7) {
      await models.BusinessStage.destroy({ where: { id } })
    }
    if (!registerType) {
      throw new Error(`Business register ${registerType} does not exist`)
    }

    return res
      .status(200)
      .json({ message: `Business register ${id} removed with success` })
  } catch (error) {
    return next(error)
  }
}
