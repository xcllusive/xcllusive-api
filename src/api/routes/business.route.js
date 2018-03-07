import express from 'express'
import validate from 'express-validation'

import { list, create, update, remove, getBusiness, updateListingAgent } from '../controllers/business.controller'

import {
  BUSINESS_MENU
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
} from '../validations/business.validation'

const router = express.Router()

router
  .use(authMiddleware)
  .use(authorizeMiddleware({ roles: [BUSINESS_MENU] }))

router
  .route('/')
  .get(list)
  .post(create)

router
  .route('/:idBusiness')
  .get(getBusiness)
  .put(update)
  .delete(remove)

router
  .route('/listing-agent/:idBusiness')
  .put(updateListingAgent)

export default router
