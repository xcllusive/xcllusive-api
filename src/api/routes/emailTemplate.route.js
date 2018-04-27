import express from 'express'
import validate from 'express-validation'
import { get, list, create, sendEmailTest } from '../controllers/emailTemplate.controller'
import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'
// import {
//   getBuyer,
//   listBuyers,
//   createBuyer,
//   updateBuyer,
//   removeBuyer
// } from '../validations/buyer.validation'

import { SYSTEM_SETTINGS_MENU } from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [SYSTEM_SETTINGS_MENU] }))

router
  .route('/')
  .get(list)
  .post(create)

router.route('/:idEmailTemplate').get(get)

router.route('/send-test').post(sendEmailTest)

export default router
