import models from '../../config/sequelize'

export const getBusiness = async (req, res, next) => {
  const {
    idBusiness
  } = req.params

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
    const user = await models.User.findOne({where: {id: req.user.id}, attributes: ['firstName', 'lastName']})
    newBusiness.listingAgent = `${user.firstName} ${user.lastName}`
    await models.Business.create(newBusiness)
    return res.status(200).json({ message: 'Business created with success' })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const {
    idBusiness
  } = req.params

  if (!idBusiness || idBusiness === undefined) Promise.reject('business id is required')

  const {
    businessName,
    firstNameV,
    lastNameV,
    vendorPhone1,
    vendorPhone2,
    vendorPhone3,
    vendorEmail,
    businessSource,
    sourceNotes,
    description,
    businessNameSecondary,
    businessABN,
    businessURL,
    address1,
    suburb,
    state,
    postCode,
    data120DayGuarantee,
    notifyOwner
  } = req.body

  const business = {
    businessName,
    firstNameV,
    lastNameV,
    vendorPhone1,
    vendorPhone2,
    vendorPhone3,
    vendorEmail,
    businessSource,
    sourceNotes,
    description,
    businessNameSecondary,
    businessABN,
    businessURL,
    address1,
    suburb,
    state,
    postCode,
    data120DayGuarantee,
    notifyOwner
  }

  try {
    await models.Business.update(business, { where: { id: idBusiness } })
    return res.status(200).json({ message: `Business ${idBusiness} updated with success` })
  } catch (error) {
    return next(error)
  }
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
