// import models from '../../config/sequelize'
// import moment from 'moment'
import APIError from '../utils/APIError'
import {
  SNS
} from '../modules/aws'

export const sendSmsUsers = async (req, res, next) => {
  const {
    users,
    message
  } = req.body

  try {
    for (let user of users) {
      if (user.phoneMobile) {
        const mobile = parseInt(user.phoneMobile.replace(/[^0-9]/g, ''), 10)
        if (mobile.toString().substr(0, 1) === '4' && mobile.toString().length === 9) {
          // send SMS via aws SNS
          const sentSms = await SNS(`+61${mobile.toString()}`, message)
          if (!sentSms) {
            throw new APIError({
              message: 'Error sending sms',
              status: 400,
              isPublic: true
            })
          }
        }
      }
    }

    return res.status(201).json({
      data: '',
      message: 'SMS Sent to User'
    })
  } catch (error) {
    return next(error)
  }
}
