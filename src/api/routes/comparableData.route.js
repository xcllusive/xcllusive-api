import express from 'express'
import validate from 'express-validation'

import { list, save, get } from '../controllers/comparableData.controller'

import { BUSINESS_MENU } from '../constants/roles'

import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'

import { list as listValidation } from '../validations/comparableData.validation'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [BUSINESS_MENU] }))

router.route('/').get(validate(listValidation), list)

router.route('/save').post(save)

router.route('/selected-list/:idAppraisal').get(get)

export default router
