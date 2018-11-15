import moment from 'moment'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'

export const get = async (req, res, next) => {
  const { idBusiness } = req.params

  try {
    const businessLog = await models.BusinessLog.findAll({ where: { id: idBusiness } })
    return res.status(200).json(businessLog)
  } catch (error) {
    return next(error)
  }
}

export const list = async (req, res, next) => {
  const { businessId, search } = req.query
  const whereOptions = {
    business_id: businessId
  }

  try {
    // Verify exists buyer
    const business = await models.Business.findOne({ where: { id: businessId } })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    if (search) {
      whereOptions.$or = [
        {
          text: {
            $like: `%${search}%`
          }
        },
        {
          followUpStatus: {
            $like: `%${search}%`
          }
        }
      ]
    }

    const logs = await models.BusinessLog.findAll({
      where: whereOptions,
      order: [['followUp', 'DESC']],
      include: [
        {
          model: models.Business,
          attributes: ['businessName']
        },
        { model: models.User, as: 'CreatedBy' },
        { model: models.User, as: 'ModifiedBy' }
      ]
    })

    return res.status(201).json({
      data: logs,
      message:
        logs.length === 0
          ? 'Nothing business log found'
          : 'Get business log with succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const save = async (req, res, next) => {
  const { idBusiness } = req.params
  const newLog = req.body

  try {
    await models.BusinessLog.update(
      { followUpStatus: 'Done' },
      { where: { business_id: idBusiness } }
    )

    await models.BusinessLog.create({
      text: newLog.businessLog_text,
      createdBy_id: req.user.id,
      followUpStatus: 'Pending',
      followUp: moment(newLog.businessLog_followUp),
      business_id: idBusiness
    })
    return res.status(200).json({ message: 'Business log Saved' })
  } catch (error) {
    return next(error)
  }
}

export const finalise = async (req, res, next) => {
  const { idBusiness } = req.params

  try {
    await models.BusinessLog.update(
      { followUpStatus: 'Done' },
      { where: { business_id: idBusiness } }
    )

    return res.status(200).json({ message: 'Business log finalised' })
  } catch (error) {
    return next(error)
  }
}
