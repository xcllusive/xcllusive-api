import express from 'express'

import {
  get,
  list,
  create,
  update,
  remove
} from '../controllers/resource.controller'

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

router
  .route('/')
  .post(create)
  .get(list)

router
  .route('/:resourceId')
  .get(get)
  .put(update)
  .delete(remove)

export default router
