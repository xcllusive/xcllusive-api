import express from 'express'
import validate from 'express-validation'

import { list, get, create, update, remove, initial, makePdf } from '../controllers/score.controller'
import * as validation from '../validations/score.validation'

import {
  BUYER_MENU
} from '../constants/roles'

import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'

const router = express.Router()

router
  .use(authMiddleware)
  .use(authorizeMiddleware({ roles: [BUYER_MENU] }))

router
  .route('/')
  .post(validate(validation.create), create)
  .get(validate(validation.list), list)

router.route('/initial').get(validate(validation.initial), initial)

router
  .route('/:scoreId')
  .get(validate(validation.get), get)
  .put(validate(validation.update), update)
  .delete(validate(validation.remove), remove)

router
  .route('/:scoreId/generate-pdf')
  .get(makePdf)

export default router
