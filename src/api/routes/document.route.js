import express from 'express'

import { get, list, create, update, remove } from '../controllers/document.controller'

import { RESOURCES_MENU } from '../constants/roles'

import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'
import { controlActivityUser } from '../middlewares/controlActivity'

const router = express.Router()

router.use(authMiddleware).use(
  authorizeMiddleware({
    roles: [RESOURCES_MENU]
  })
)

router.use(controlActivityUser('ToolsAndDocs'))

router
  .route('/documentFolder')
  .post(create)
  .get(list)

router
  .route('/documentFolder/:documentFolderId')
  .get(get)
  .put(update)
  .delete(remove)

export default router
