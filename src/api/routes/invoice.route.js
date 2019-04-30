import express from 'express'
import validate from 'express-validation'
import {
  get,
  getLast,
  list,
  create,
  update,
  remove,
  makePdf,
  sendEmail
} from '../controllers/invoice.controller'

import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'

import validation from '../validations/invoice.validation'

import {
  BUSINESS_MENU
} from '../constants/roles'
import {
  controlActivityUser
} from '../middlewares/controlActivity'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({
  roles: [BUSINESS_MENU]
}))

router.use(controlActivityUser('Business'))

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

router.route('/send-email').post(validate(validation.sendEmail), sendEmail)

export default router
