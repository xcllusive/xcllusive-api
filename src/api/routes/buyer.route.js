import express from 'express'
import validate from 'express-validation'
import { get, list, create, update, remove } from '../controllers/buyer.controller'
import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'
import {
  getBuyer,
  listBuyers,
  createBuyer,
  updateBuyer,
  removeBuyer
} from '../validations/buyer.validation'

import { BUYER_MENU } from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [BUYER_MENU] }))

router
  .route('/')
  .get(validate(listBuyers), list)
  .post(validate(createBuyer), create)

router
  .route('/:idBuyer')
  .get(validate(getBuyer), get)
  .put(validate(updateBuyer), update)
  .delete(validate(removeBuyer), remove)

export default router
