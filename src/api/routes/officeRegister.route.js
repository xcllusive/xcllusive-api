import express from 'express'

import {
  get,
  list,
  create,
  update,
  remove
} from '../controllers/officeRegister.controller'

import {
  SYSTEM_SETTINGS_MENU
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
  roles: [SYSTEM_SETTINGS_MENU]
}))

router.use(controlActivityUser('SystemSettings'))

router
  .route('/')
  .post(create)
  .get(list)

router
  .route('/:officeRegisterId')
  .get(get)
  .put(update)
  .delete(remove)

export default router
