import express from 'express'
import validate from 'express-validation'
import {
  get,
  getLast,
  list,
  create,
  update,
  remove,
  makePdf
} from '../controllers/invoice.controller'

import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'

import validation from '../validations/invoice.validation'

import { BUSINESS_MENU } from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [BUSINESS_MENU] }))

router
  .route('/:idInvoice/download-pdf')
  .get(validate(validation.makePdf), makePdf)

router
  .route('/last')
  .get(validate(validation.getLast), getLast)

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
