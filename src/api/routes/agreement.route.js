import express from 'express'
import validate from 'express-validation'
import {
  get,
  generate,
  update,
  sendEmail,
  getEmailTemplate,
  save
} from '../controllers/agreement.controller'
import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'
import {
  controlActivityUser
} from '../middlewares/controlActivity'
import validation from '../validations/agreement.validation'
import {
  BUSINESS_MENU
} from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({
  roles: [BUSINESS_MENU]
}))

router.use(controlActivityUser('Business'))

router
  .route('/generate')
  .post(validate(validation.generate), generate)

router.route('/send-email').post(validate(validation.sendEmail), sendEmail)

router
  .route('/:businessId')
  .get(validate(validation.get), get)
  .put(validate(validation.update), update).post(save)

router.route('/template-compiled/:idEmailTemplate')
  .get(validate(validation.getEmailTemplate), getEmailTemplate)

export default router
