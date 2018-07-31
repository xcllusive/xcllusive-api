import express from 'express'
import validate from 'express-validation'
import {
  get,
  list,
  create,
  update
} from '../controllers/agreementTemplate.controller'

import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'

import validation from '../validations/agreementTemplate.validation'

import { SYSTEM_SETTINGS_MENU } from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [SYSTEM_SETTINGS_MENU] }))

router
  .route('/')
  .get(validate(validation.list), list)
  .post(validate(validation.create), create)

router
  .route('/:idAgreementTemplate')
  .get(validate(validation.get), get)
  .put(validate(validation.update), update)

export default router
