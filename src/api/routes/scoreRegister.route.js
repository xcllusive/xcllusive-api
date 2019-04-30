import express from 'express'
import validate from 'express-validation'

import {
  list,
  get,
  create,
  update,
  remove
} from '../controllers/scoreRegister.controller'
import * as validation from '../validations/scoreRegister.validation'

import {
  BUSINESS_MENU,
  BUYER_MENU
} from '../constants/roles'

import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'
import {
  controlActivityUser
} from '../middlewares/controlActivity'

const router = express.Router()

router
  .use(authMiddleware)
  .use(authorizeMiddleware({
    roles: [BUSINESS_MENU, BUYER_MENU]
  }))

router.use(controlActivityUser('Buyer'))

router
  .route('/')
  .post(validate(validation.create), create)
  .get(validate(validation.list), list)

router
  .route('/:scoreRegisterId')
  .get(validate(validation.get), get)
  .put(validate(validation.update), update)
  .delete(validate(validation.remove), remove)

export default router
