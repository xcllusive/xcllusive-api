import express from 'express'
import validate from 'express-validation'
import {
  get,
  create,
  update
} from '../controllers/invoice.controller'

import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'

import validation from '../validations/invoice.validation'

import { BUSINESS_MENU } from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [BUSINESS_MENU] }))

router
  .route('/')
  .post(validate(validation.generate), create)

router
  .route('/:idInvoice')
  .get(validate(validation.get), get)
  .put(validate(validation.update), update)

export default router
