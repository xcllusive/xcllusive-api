import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  const {
    buyerRegister
  } = req.query

  const limit = req.query.limit
  const offset = req.skip

  try {
    switch (parseInt(buyerRegister, 10)) {
      case 1:
        const registers1 = await models.BuyerType.findAndCountAll({
          limit,
          offset
        })
        return res.status(201).json({
          data: registers1,
          pageCount: registers1.count,
          itemCount: Math.ceil(registers1.count / req.query.limit)
        })
      case 2:
        const registers2 = await models.BuyerSource.findAndCountAll({
          limit,
          offset
        })
        return res.status(201).json({
          data: registers2,
          pageCount: registers2.count,
          itemCount: Math.ceil(registers2.count / req.query.limit)
        })
      default:
        throw new Error(`Buyer register ${buyerRegister} does not exist`)
    }
  } catch (error) {
    return next(error)
  }
}

export const get = async (req, res, next) => {
  const {
    buyerRegister
  } = req.query
  const {
    buyerRegisterId
  } = req.params

  try {
    switch (parseInt(buyerRegister, 10)) {
      case 1:
        const register1 = await models.BuyerType.findOne({
          where: {
            id: buyerRegisterId
          }
        })
        return res.status(201).json({
          data: register1
        })
      case 2:
        const register2 = await models.BuyerSource.findOne({
          where: {
            id: buyerRegisterId
          }
        })
        return res.status(201).json({
          data: register2
        })
      default:
        throw new Error(`Buyer register ${buyerRegister} does not exist`)
    }
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const {
    label,
    buyerRegister
  } = req.body

  try {
    if (buyerRegister === 1) {
      await models.BuyerType.create({
        label
      })
    }
    if (!buyerRegister) {
      throw new Error(`Buyer register ${buyerRegister} does not exist`)
    }

    if (buyerRegister === 2) {
      await models.BuyerSource.create({
        label
      })
    }
    if (!buyerRegister) {
      throw new Error(`Buyer register ${buyerRegister} does not exist`)
    }

    return res.status(200).json({
      message: `Buyer register ${label} created`
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const {
    label,
    buyerRegister
  } = req.body

  const {
    buyerRegisterId
  } = req.params

  try {
    if (buyerRegister === 1) {
      await models.BuyerType.update({
        label
      }, {
        where: {
          id: buyerRegisterId
        }
      })
    }

    if (buyerRegister === 2) {
      await models.BuyerSource.update({
        label
      }, {
        where: {
          id: buyerRegisterId
        }
      })
    }

    if (!buyerRegister) {
      throw new Error(`Buyer register ${buyerRegister} does not exist`)
    }

    return res.status(200).json({
      message: `Buyer register ${label} updated`
    })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const {
    buyerRegister
  } = req.body

  const {
    buyerRegisterId
  } = req.params

  try {
    // const existsRegisterType = await models.Business.findAll({
    //   raw: true,
    //   attributes: ['id', 'sourceId'],
    //   where: {
    //     sourceId: id
    //   }
    // })

    // if (existsRegisterType.length > 0) {
    //   return res.status(406).json({
    //     error: `You can NOT delete that! Business register ${id} has been using in one or more businesses`
    //   })
    // }
    if (buyerRegister === 1) {
      await models.BuyerType.destroy({
        where: {
          id: buyerRegisterId
        }
      })
    }

    if (buyerRegister === 2) {
      await models.BuyerSource.destroy({
        where: {
          id: buyerRegisterId
        }
      })
    }

    if (!buyerRegister) {
      throw new Error(`Buyer register ${buyerRegister} does not exist`)
    }

    return res
      .status(200)
      .json({
        message: `Buyer register ${buyerRegisterId} removed with success`
      })
  } catch (error) {
    return next(error)
  }
}
