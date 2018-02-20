import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  try {
    const business = await models.Business.findAll()
    return res.status(200).json(business)
  } catch (err) {
    return next(err)
  }
}

export const create = async (req, res, next) => {
  const newBusiness = {
    businessName: req.body.businessName,
    firstNameV: req.body.firstName,
    lastNameV: req.body.lastName,
    vendorPhone1: req.body.vendorPhone1,
    vendorPhone2: req.body.vendorPhone2,
    vendorPhone3: req.body.vendorPhone3,
    vendorEmail: req.body.vendorEmail,
    businessSource: req.body.businessSource,
    sourceNotes: req.body.sourceNotes,
    description: req.body.description
  }

  try {
    await models.Business.create(newBusiness)
    return res.status(200).json({ message: 'Business created with success' })
  } catch (error) {
    return next(error)
  }
}

export const update = (req, res, next) => {

}

export const remove = async (req, res, next) => {
  const { id } = req.body
  try {
    await models.User.destroy({ where: { id } })
    return res.status(200).json({ message: 'User removed with success' })
  } catch (error) {
    return next(error)
  }
}
