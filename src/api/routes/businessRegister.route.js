import express from 'express'

import {
  list,
  create,
  update,
  remove
} from '../controllers/businessRegister.controller'

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

router
  .use(authMiddleware)
  .use(authorizeMiddleware({
    roles: [BUSINESS_MENU]
  }))

router.use(controlActivityUser('Business'))

router
  .route('/')
  .post(create)

router
  .route('/:businessRegister')
  .get(list)
  .put(update)
  .delete(remove)

export default router
