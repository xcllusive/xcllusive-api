import express from 'express'
// import validate from 'express-validation'
import {
  getMarketingReport,
  getAllAnalysts,
  getAnalystReport,
  getQtdeBusinessesStagePerUser,
  getBusinessesPerAnalyst
} from '../controllers/reports.controller'
import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'

import {
  MANAGEMENT_MENU
} from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(
  authorizeMiddleware({
    roles: [MANAGEMENT_MENU]
  })
)
router.route('/analyst-report').get(getAnalystReport)

router.route('/marketing-report').get(getMarketingReport)

router.route('/all-analysts').get(getAllAnalysts)

router.route('/qtde-businesses-stage-per-user').get(getQtdeBusinessesStagePerUser)

router.route('/businesses-list-analyst').get(getBusinessesPerAnalyst)

export default router
