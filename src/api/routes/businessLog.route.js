import express from 'express'

import { list, get } from '../controllers/businessLog.controller'

import {
  BUSINESS_MENU
} from '../constants/roles'

import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'

const router = express.Router()

router
  .use(authMiddleware)
  .use(authorizeMiddleware({ roles: [BUSINESS_MENU] }))

router
  .route('/')
  .get(list)

router
  .route('/:id')
  .get(get)

export default router
