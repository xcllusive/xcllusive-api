import express from 'express'
// import validate from 'express-validation'
import {
  getMarketingReport,
  getAllAnalysts,
  getAnalystReport,
  getQtdeBusinessesStagePerUser,
  getBusinessesPerAnalyst,
  getEnquiryReport,
  activityRequestControlPerUser,
  getUsersPerRegion
} from '../controllers/reports.controller'
import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'

import {
  MANAGEMENT_MENU
} from '../constants/roles'
import {
  controlActivityUser
} from '../middlewares/controlActivity'

const router = express.Router()

router.use(authMiddleware).use(
  authorizeMiddleware({
    roles: [MANAGEMENT_MENU]
  })
)

router.use(controlActivityUser('Management'))

router.route('/analyst-report').get(getAnalystReport)

router.route('/marketing-report').get(getMarketingReport)

router.route('/enquiry-report').get(getEnquiryReport)

router.route('/all-analysts').get(getAllAnalysts)

router.route('/qtde-businesses-stage-per-user').get(getQtdeBusinessesStagePerUser)

router.route('/businesses-list-analyst').get(getBusinessesPerAnalyst)

router.route('/activity-request-per-user-report').get(activityRequestControlPerUser)

router.route('/users-per-region').get(getUsersPerRegion)

export default router
