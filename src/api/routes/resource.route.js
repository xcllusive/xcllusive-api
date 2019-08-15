import express from 'express'

import {
  get,
  list,
  create,
  update,
  remove
} from '../controllers/resource.controller'

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
