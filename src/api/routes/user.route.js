import express from 'express'
import validate from 'express-validation'

import { list, create, update, remove } from '../controllers/user.controller'

import {
  LIST_USERS,
  CREATE_USER
} from '../constants/roles'

import { 
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'

import {
  listUsers,
  createUser,
  replaceUser,
  updateUser
} from '../validations/user.validation'

const router = express.Router()

router
  .use(authMiddleware)

router
  .route('/')
  .get(authorizeMiddleware( { roles: [ LIST_USERS ] } ), list)
  .post(create)
  .put(update)
  .delete(remove)

export default router
