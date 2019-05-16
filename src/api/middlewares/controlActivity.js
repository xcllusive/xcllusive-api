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
          dateCreated: moment().format('YYYY-MM-DD')
        }
      } else {
        newControlActivity = {
          menu: menu,
          userId_logged: req.user.id,
          dateCreated: moment().format('YYYY-MM-DD')
        }
      }

      const lastActivity = await models.ControlActivity.findOne({
        where: {
          userId_logged: req.user.id,
          menu: menu,
          dateCreated: moment().format('YYYY-MM-DD')
        },
        order: [
          [
            'dateTimeCreated', 'DESC'
          ]
        ]
      })
      if (moment().format('YYYY-MM-DD hh:mm:ss') !== (lastActivity && moment(lastActivity.dateTimeCreated).format('YYYY-MM-DD hh:mm:ss'))) {
        await models.ControlActivity.create(newControlActivity)
      } else {
        if (lastActivity === null) {
          await models.ControlActivity.create(newControlActivity)
        }
      }
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
