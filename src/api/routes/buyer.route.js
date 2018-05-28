import express from 'express'
import validate from 'express-validation'
import {
  get,
  list,
  create,
  update,
  remove,
  sendCA,
  sendIM,
  receivedCA,
  listLog,
  updateLog,
  listBusinessesFromBuyerLog,
  listBusinessesFromBuyer
} from '../controllers/buyer.controller'
import * as validation from '../validations/buyer.validation'
import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'
import { BUYER_MENU } from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [BUYER_MENU] }))

router.route('/log/:idBuyer').get(validate(validation.listLog), listLog)

router.router('/:idBuyer/log/:idLog').put(updateLog)

router
  .route('/log/from-business/:idBuyer')
  .get(validate(validation.listBusinessesFromBuyerLog), listBusinessesFromBuyerLog)

router
  .route('/:idBuyer/business')
  .get(validate(validation.listBusinessesFromBuyer), listBusinessesFromBuyer)

router
  .route('/:idBuyer')
  .get(validate(validation.getBuyer), get)
  .put(validate(validation.updateBuyer), update)
  .delete(validate(validation.removeBuyer), remove)

router
  .route('/')
  .get(validate(validation.listBuyers), list)
  .post(validate(validation.createBuyer), create)

router.route('/send-ca').post(validate(validation.sendCA), sendCA)

router.route('/send-im').post(validate(validation.sendIM), sendIM)

router.route('/received-ca').post(validate(validation.receivedCA), receivedCA)

export default router
