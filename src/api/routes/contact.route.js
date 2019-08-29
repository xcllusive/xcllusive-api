import express from 'express'

import {
  sendSmsUsers
} from '../controllers/contact.controller'

import {
  TOOLS_AND_DOCS_MENU
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
  roles: [TOOLS_AND_DOCS_MENU]
}))

router.use(controlActivityUser('ToolsAndDocs'))

router.route('/send-sms-users').post(sendSmsUsers)

export default router
