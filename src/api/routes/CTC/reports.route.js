import express from 'express'
// import validate from 'express-validation'
import {
  getMarketingReport,
  getBusinessesPerAnalyst,
  getAllAnalysts,
  getQtdeBusinessesStagePerUser,
  getAnalystReport
} from '../../controllers/CTC/reports.controller'
import {
  authMiddleware,
  authorizeMiddleware
} from '../../middlewares/auth'

import {
  MANAGEMENT_MENU
} from '../../constants/roles'
import {
  controlActivityUser
} from '../../middlewares/controlActivity'

const router = express.Router()

router.use(authMiddleware).use(
  authorizeMiddleware({
    roles: [MANAGEMENT_MENU]
  })
)

router.use(controlActivityUser('Management'))

router.route('/marketing-report').get(getMarketingReport)

router.route('/businesses-list-analyst').get(getBusinessesPerAnalyst)

router.route('/all-analysts').get(getAllAnalysts)

router.route('/qtde-businesses-stage-per-user').get(getQtdeBusinessesStagePerUser)

router.route('/analyst-report').get(getAnalystReport)

export default router
