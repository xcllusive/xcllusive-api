import express from 'express'
import validate from 'express-validation'
import * as validation from '../validations/systemSettings.validation'
import {
  getAllSettings,
  update
} from '../controllers/systemSettings.controller'
import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'
import { SYSTEM_SETTINGS_MENU } from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [SYSTEM_SETTINGS_MENU] }))

router.route('/')
  .get(getAllSettings)
  .put(validate(validation.update), update)

export default router
