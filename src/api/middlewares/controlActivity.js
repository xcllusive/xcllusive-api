import models from '../../config/sequelize'
import moment from 'moment'

export const controlActivityUser = (menu) => {
  return async (req, res, next) => {
    const newControlActivity = {
      menu: menu,
      userId_logged: req.user.id,
      dateTimeCreated: moment().format('YYYY-MM-DD hh:mm:ss')
    }
    try {
      await models.ControlActivity.create(newControlActivity)
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
