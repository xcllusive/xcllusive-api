import express from 'express'

import {
  sendSmsUsers
} from '../controllers/contact.controller'

import {
  RESOURCES_MENU
} from '../constants/roles'

import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'
import {
  controlActivityUser
} from '../middlewares/controlActivity'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({
  roles: [RESOURCES_MENU]
}))

router.use(controlActivityUser('ToolsAndDocs'))

router.route('/send-sms-users').post(sendSmsUsers)

export default router
