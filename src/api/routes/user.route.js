import express from 'express'
import validate from 'express-validation'

import { list, create, update, remove, getLogged } from '../controllers/user.controller'

import { SYSTEM_SETTINGS_MENU } from '../constants/roles'

import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'

import {
  listUsers,
  createUser,
  replaceUser,
  updateUser
} from '../validations/user.validation'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [SYSTEM_SETTINGS_MENU] }))

router
  .route('/')
  .get(list)
  .post(create)
  .put(update)
  .delete(remove)

router.route('/user-logged').get(getLogged)

export default router
