import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  const {
    businessRegister
  } = req.query

  try {
    switch (parseInt(businessRegister, 10)) {
      case 1:
        return res.status(200).json(await models.BusinessSource.findAll())
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
    if (!businessRegister) {
      throw new Error(`Business register ${businessRegister} does not exist`)
    }

    return res.status(200).json({ message: `Business register ${label} created` })
  } catch (error) {
    return next(error)
  }
}
