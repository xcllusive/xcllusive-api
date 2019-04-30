import express from 'express'

import {
  list,
  get,
  save,
  finalise
} from '../controllers/businessLog.controller'

import {
  BUSINESS_MENU
} from '../constants/roles'

import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'
import {
  controlActivityUser
} from '../middlewares/controlActivity'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({
  roles: [BUSINESS_MENU]
}))

router.use(controlActivityUser('Business'))

router.route('/').get(list)

router.route('/:idBusiness/finalise').post(finalise)

router
  .route('/:idBusiness')
  .get(get)
  .put(save)

export default router
