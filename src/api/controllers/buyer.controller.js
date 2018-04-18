import models from '../../config/sequelize'

export const get = async (req, res, next) => {}

export const list = async (req, res, next) => {
  try {
    const buyers = await models.Buyer.findAll({
      include: [
        {
          model: models.User
        }
      ],
      raw: true
    })
    return res.status(200).json({
      error: false,
      data: buyers,
      message: 'Success'
    })
  } catch (error) {
    console.log(error)
    return res.json({
      error: true,
      data: [],
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
      error: false,
      data: buyer,
      message: 'Buyer created with success'
    })
  } catch (error) {
    return res.status(201).json({
      error: true,
      data: [],
      message: error
    })
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
