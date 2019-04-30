import express from 'express'
// import validate from 'express-validation'
import {
  get,
  list,
  create,
  update,
  sendEmail,
  sendEmailTest
} from '../controllers/emailTemplate.controller'
import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'
// import {
//   getBuyer,
//   listBuyers,
//   createBuyer,
//   updateBuyer,
//   removeBuyer
// } from '../validations/buyer.validation'

import {
  SYSTEM_SETTINGS_MENU
} from '../constants/roles'
import {
  controlActivityUser
} from '../middlewares/controlActivity'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({
  roles: [SYSTEM_SETTINGS_MENU]
}))

router.use(controlActivityUser('SystemSettings'))

router
  .route('/')
  .get(list)
  .post(create)

router
  .route('/:idEmailTemplate')
  .get(get)
  .put(update)

router.route('/send-email').post(sendEmail)

router.route('/send-test').post(sendEmailTest)

export default router
