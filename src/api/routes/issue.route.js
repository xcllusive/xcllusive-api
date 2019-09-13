import express from 'express'

import {
  list,
  create,
  update,
  remove
} from '../controllers/issue.controller'

import {
  BUSINESS_MENU
} from '../constants/roles'

import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'

const router = express.Router()

router
  .use(authMiddleware)
  .use(authorizeMiddleware({
    roles: [BUSINESS_MENU]
  }))

router
  .route('/')
  .post(create)
  .get(list)

router
  .route('/:issueId')
  .put(update)
  .delete(remove)

export default router
