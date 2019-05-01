import models from '../../config/sequelize'
import moment from 'moment'

export const controlActivityUser = (menu) => {
  return async (req, res, next) => {
    try {
      let newControlActivity = {}
      if (menu === 'Login') {
        const user = await models.User.findOne({
          where: {
            email: req.body.email
          }
        })
        newControlActivity = {
          menu: menu,
          userId_logged: user.id,
          dateTimeCreated: moment().format('YYYY-MM-DD hh:mm:ss'),
          dateCreated: moment().format('YYYY-MM-DD')
        }
      } else {
        newControlActivity = {
          menu: menu,
          userId_logged: req.user.id,
          dateTimeCreated: moment().format('YYYY-MM-DD hh:mm:ss'),
          dateCreated: moment().format('YYYY-MM-DD')
        }
      }

      await models.ControlActivity.create(newControlActivity)
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
