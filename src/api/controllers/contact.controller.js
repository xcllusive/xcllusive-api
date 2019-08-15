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
    // for (let user of users) {
    //   if (user.phoneMobile) {
    //     const mobile = parseInt(user.phoneMobile.replace(/[^0-9]/g, ''), 10)
    //     // if (mobile.toString().substr(0, 1) === '4' && mobile.toString().length === 9) {
    //     //   // send SMS via aws SNS
    //     //   console.log('mobile', mobile)
    //     //   const sentSms = await SNS(mobile.toString(), message)
    //     //   console.log(sentSms)
    //     //   if (!sentSms) {
    //     //     throw new APIError({
    //     //       message: 'Error sending sms',
    //     //       status: 400,
    //     //       isPublic: true
    //     //     })
    //     //   }
    //     // }

    //   }
    // }
    const sentSms = await SNS('0468939756', message)

    return res.status(201).json({
      data: '',
      message: 'Sms Sent to Onwer'
    })
  } catch (error) {
    return next(error)
  }
}
