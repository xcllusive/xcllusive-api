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
  createLog,
  listBusinessesFromBuyerLog,
  listBusinessesFromBuyer,
  finaliseLog,
  listBusiness,
  getBuyersFromBusiness,
  getBusinessFromBuyer,
  getGroupEmail,
  sendGroupEmail,
  createWeeklyReport,
  getLastWeeklyReport,
  updateWeeklyReport,
  getBrokersPerRegion,
  getBusinessesPerBroker,
  getBusinessHistoricalWeekly,
  verifyDuplicatedBuyer,
  updateBusinessFromBuyer,
  getBusinessLogFromBuyer,
  updateBusinessLogFromBuyer,
  finaliseBusinessLogFromBuyer
} from '../controllers/buyer.controller'
import * as validation from '../validations/buyer.validation'
import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'
import {
  BUYER_MENU
} from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({
  roles: [BUYER_MENU]
}))

router.route('/from-business/:idBusiness').get(getBuyersFromBusiness)

router.route('/business-from-buyer/:idBusiness').get(getBusinessFromBuyer).put(updateBusinessFromBuyer)
router.route('/business-log-from-buyer').get(getBusinessLogFromBuyer)
router.route('/business-log-from-buyer/:idBusiness/finalise').post(finaliseBusinessLogFromBuyer)

router.route('/business-log-from-buyer/:idBusiness').put(updateBusinessLogFromBuyer)

router.route('/business').get(validate(validation.listBusiness), listBusiness)

router.route('/log/:idBuyer').get(validate(validation.listLog), listLog)

router.route('/duplicated-buyer').get(verifyDuplicatedBuyer)

router
  .route('/broker/weekly-report')
  .post(validate(validation.createWeeklyReport), createWeeklyReport)
  .get(validate(validation.getLastWeeklyReport), getLastWeeklyReport)
  .put(validate(validation.updateWeeklyReport), updateWeeklyReport)

router.route('/broker/brokers-region').get(getBrokersPerRegion)
router.route('/broker/businesses-broker').get(getBusinessesPerBroker)
router.route('/broker/business-historical-weekly').get(getBusinessHistoricalWeekly)

router.route('/log/:idLog').put(updateLog)

router.route('/log').post(createLog)

router
  .route('/:idBusiness/group-email')
  .get(validate(validation.getGroupEmail), getGroupEmail)

router.route('/send-group-email').post(sendGroupEmail)

router.route('/:idBuyer/log/finalise').post(validate(validation.finaliseLog), finaliseLog)

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
