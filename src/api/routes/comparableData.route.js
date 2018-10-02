import express from 'express'
import validate from 'express-validation'

import { list } from '../controllers/comparableData.controller'

import { BUSINESS_MENU } from '../constants/roles'

import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'

import { list as listValidation } from '../validations/comparableData.validation'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [BUSINESS_MENU] }))

router.route('/').get(validate(listValidation), list)

export default router
