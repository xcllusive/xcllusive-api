import express from 'express'
import validate from 'express-validation'
import {
  get,
  list,
  create,
  update,
  remove
} from '../controllers/invoice.controller'

import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'

import validation from '../validations/invoice.validation'

import { BUSINESS_MENU } from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [BUSINESS_MENU] }))

router
  .route('/')
  .get(validate(validation.list), list)
  .post(validate(validation.create), create)

router
  .route('/:idInvoice')
  .get(validate(validation.get), get)
  .put(validate(validation.update), update)
  .delete(validate(validation.remove), remove)

export default router
