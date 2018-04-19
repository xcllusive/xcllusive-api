import models from '../../config/sequelize'

export const get = async (req, res, next) => {
  const { idBuyer: id } = req.params

  try {
    const buyer = await models.Buyer.findOne({ where: { id } })

    return res.status(201).json({
      data: buyer,
      message: 'Success'
    })
  } catch (error) {
    return next(error)
  }
}

export const list = async (req, res, next) => {
  const { perPage } = req.query
  const existingParams = [
    'firstName',
    'surname',
    'displayName',
    'email',
    'telephone1',
    'telephone2',
    'telephone3',
    'emailOptional'
  ].filter(field => req.query[field])
  const whereOptions = {}

  if (existingParams.length) {
    existingParams.map(item => {
      whereOptions.where = {}
      whereOptions.where.$or = []
      whereOptions.where.$or.push({
        [item]: {
          $like: `%${req.query[item]}%`
        }
      })
    })
  }

  console.log(whereOptions)

  const options = {
    attributes: [
      'id',
      'firstName',
      'surname',
      'email',
      'streetName',
      'telephone1',
      'caSent',
      'caReceived'
    ],
    limit: perPage
  }

  try {
    const buyers = await models.Buyer.findAll(Object.assign(options, whereOptions))
    return res.status(200).json({
      data: buyers,
      message: 'Success'
    })
  } catch (error) {
    return res.json({
      error: true,
      message: error
    })
  }
}

export const create = async (req, res, next) => {
  const newBuyer = req.body

  newBuyer.createdBy_id = req.user.id
  newBuyer.modifiedBy_id = req.user.id

  try {
    const buyer = await models.Buyer.create(newBuyer)
    return res.status(201).json({
      data: buyer,
      message: 'Buyer created with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  console.log('update')
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
