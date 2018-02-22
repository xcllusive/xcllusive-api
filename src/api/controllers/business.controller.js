import models from '../../config/sequelize'

export const getBusiness = async (req, res, next) => {
  const {
    idBusiness
  } = req.params

  console.log(req.params)

  try {
    const business = await models.Business.findOne({ where: { id: idBusiness } })
    return res.status(200).json(business)
  } catch (err) {
    return next(err)
  }
}

export const list = async (req, res, next) => {
  const {
    search
  } = req.query

  const whereOptions = search && search.length > 1
    ? {
      where: {
        $or: [
          {
            id: {
              $like: `%${search}%`
            }
          },
          {
            businessName: {
              $like: `%${search}%`
            }
          },
          {
            firstNameV: {
              $like: `%${search}%`
            }
          },
          {
            lastNameV: {
              $like: `%${search}%`
            }
          }
        ]
      }
    }
    : null
  const options = {
    attributes: ['id', 'businessName', 'firstNameV', 'lastNameV']
  }
  try {
    const businesses = await models.Business.findAll(Object.assign(options, whereOptions))
    return res.status(200).json(businesses)
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
    description: req.body.description,
    stage: 'Potential Listing'
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
