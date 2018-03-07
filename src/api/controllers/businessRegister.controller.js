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
    switch (businessRegister) {
      case 1:
        await models.BusinessSource.create({ label })
        break
      case 2:
        await models.BusinessRating.create({ label })
        break
      case 3:
        await models.BusinessProduct.create({ label })
        break
      case 4:
        await models.BusinessIndustry.create({ label })
        break
      case 5:
        await models.BusinessType.create({ label })
        break
      case 6:
        await models.BusinessOwnersTime.create({ label })
        break
      default:
        throw new Error(`Business register ${businessRegister} does not exist`)
    }
    return res.status(200).json({ message: `Business register ${label} created` })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
