import express from 'express'
import validate from 'express-validation'
import {
  get,
  list,
  create,
  update,
  preview
} from '../controllers/agreementTemplate.controller'

import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'

import validation from '../validations/agreementTemplate.validation'

import {
  SYSTEM_SETTINGS_MENU
} from '../constants/roles'
import {
  controlActivityUser
} from '../middlewares/controlActivity'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({
  roles: [SYSTEM_SETTINGS_MENU]
}))

router.use(controlActivityUser('SystemSettings'))

router
  .route('/')
  .get(validate(validation.list), list)
  .post(validate(validation.create), create)

router
  .route('/:idAgreementTemplate')
  .get(validate(validation.get), get)
  .put(validate(validation.update), update)

router
  .route('/preview/:idAgreementTemplate')
  .post(validate(validation.preview), preview)

export default router
