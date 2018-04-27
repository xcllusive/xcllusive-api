import express from 'express'
import validate from 'express-validation'
import {
  get,
  list,
  create,
  update,
  remove,
  sendCA
} from '../controllers/buyer.controller'
import * as validation from '../validations/buyer.validation'
import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'
import { BUYER_MENU } from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [BUYER_MENU] }))

router
  .route('/')
  .get(validate(validation.listBuyers), list)
  .post(validate(validation.createBuyer), create)

router
  .route('/:idBuyer')
  .get(validate(validation.getBuyer), get)
  .put(validate(validation.updateBuyer), update)
  .delete(validate(validation.removeBuyer), remove)

router.route('/send-ca').post(validate(validation.sendCA), sendCA)

export default router
