import express from 'express'

import {
  get,
  list,
  create,
  update,
  remove
} from '../controllers/buyerRegister.controller'

import { SYSTEM_SETTINGS_MENU } from '../constants/roles'

import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [SYSTEM_SETTINGS_MENU] }))

router
  .route('/')
  .post(create)
  .get(list)

router
  .route('/:buyerRegisterId')
  .get(get)
  .put(update)
  .delete(remove)

export default router