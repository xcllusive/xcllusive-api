import express from 'express'
import validate from 'express-validation'

import {
  list,
  save,
  get,
  getBusinessTypeAny
} from '../controllers/comparableData.controller'

import {
  BUSINESS_MENU
} from '../constants/roles'

import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'

import {
  list as listValidation
} from '../validations/comparableData.validation'
import {
  controlActivityUser
} from '../middlewares/controlActivity'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({
  roles: [BUSINESS_MENU]
}))

router.use(controlActivityUser('Business'))

router.route('/').get(validate(listValidation), list)

router.route('/save').post(save)

router.route('/selected-list/:idAppraisal').get(get)

router.route('/business-type-any').get(getBusinessTypeAny)

export default router
