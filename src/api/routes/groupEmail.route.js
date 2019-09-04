import express from 'express'

import {
  list,
  create,
  listEmailTemplates,
  createEmailTemplate
} from '../controllers/groupEmail.controller'

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

router.use(authMiddleware).use(
  authorizeMiddleware({
    roles: [TOOLS_AND_DOCS_MENU]
  })
)

router.use(controlActivityUser('ToolsAndDocs'))

router
  .route('/folder')
  .post(create)
  .get(list)

router
  .route('/template/:folderId')
  .post(createEmailTemplate)
  .get(listEmailTemplates)

export default router
