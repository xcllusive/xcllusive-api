import models from '../../config/sequelize'
import { mapValuesOnArrayToDropdownBusinessRegisters } from '../utils/sharedFunctionsArray'

export const list = async (req, res, next) => {
  const {
    businessRegister
  } = req.params

  try {
    switch (parseInt(businessRegister, 10)) {
      case 1: {
        const values = await models.BusinessSource.findAll({ raw: true })
        return res.status(200).json(mapValuesOnArrayToDropdownBusinessRegisters(values))
      }
      case 2:
        return res.status(200).json(await models.BusinessRating.findAll())
      case 3:
        return res.status(200).json(await models.BusinessProduct.findAll())
      case 4:
        return res.status(200).json(await models.BusinessIndustry.findAll())
      case 5:
        return res.status(200).json(await models.BusinessType.findAll())
      case 6:
        return res.status(200).json(await models.BusinessOwnersTime.findAll())
      case 7:
        return res.status(200).json(await models.BusinessStage.findAll())
      default:
        throw new Error(`Business register ${businessRegister} does not exist`)
    }
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const {
    label,
    businessRegister
  } = req.body

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
  const {
    label,
    businessRegister
  } = req.body

  const {
    businessRegister: id
  } = req.params

  try {
    if (businessRegister === 1) {
      await models.BusinessSource.update({ label }, { where: { id } })
    }
    if (businessRegister === 2) {
      await models.BusinessRating.update({ label }, { where: { id } })
    }
    if (businessRegister === 3) {
      await models.BusinessProduct.update({ label }, { where: { id } })
    }
    if (businessRegister === 4) {
      await models.BusinessIndustry.update({ label }, { where: { id } })
    }
    if (businessRegister === 5) {
      await models.BusinessType.update({ label }, { where: { id } })
    }
    if (businessRegister === 6) {
      await models.BusinessOwnersTime.update({ label }, { where: { id } })
    }
    if (businessRegister === 7) {
      await models.BusinessStage.update({ label }, { where: { id } })
    }
    if (!businessRegister) {
      throw new Error(`Business register ${businessRegister} does not exist`)
    }

    return res.status(200).json({ message: `Business register ${label} updated` })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const {
    registerType
  } = req.body

  const {
    businessRegister: id
  } = req.params

  try {
    const existsRegisterType = await models.Business.findAll({ raw: true }, { where: { sourceId: id } })
    if (existsRegisterType.length > 0) {
      return res.status(406).json({ error: `You can NOT delete that! Business register ${id} has been using in one or more businesses` })
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

    return res.status(200).json({ message: `Business register ${id} removed with success` })
  } catch (error) {
    return next(error)
  }
}