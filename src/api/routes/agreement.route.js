import express from 'express'
import validate from 'express-validation'
import {
  get,
  generate,
  update,
  sendEmail,
  getEmailTemplate
} from '../controllers/agreement.controller'

import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'

import validation from '../validations/agreement.validation'

import { BUSINESS_MENU } from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [BUSINESS_MENU] }))

router
  .route('/generate')
  .post(validate(validation.generate), generate)

router
  .route('/:idAgreement')
  .get(validate(validation.get), get)
  .put(validate(validation.update), update)

router.route('/template-compiled/:idEmailTemplate')
  .get(validate(validation.getEmailTemplate), getEmailTemplate)

router.route('/send-email').post(validate(validation.sendEmail), sendEmail)

export default router
