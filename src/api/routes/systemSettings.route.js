import express from 'express'
import validate from 'express-validation'
import * as validation from '../validations/systemSettings.validation'
import {
  getAllSettings,
  update,
  executeJavaScript,
  exportBuyers
} from '../controllers/systemSettings.controller'
import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'
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

router.route('/')
  .get(getAllSettings)
  .put(validate(validation.update), update)

router.route('/export-buyers')
  .post(exportBuyers)

router.route('/execute-javascript')
  .get(executeJavaScript)

export default router
