import express from 'express'
// import validate from 'express-validation'
import {
  getMarketingReport,
  getAllAnalysts,
  getAnalystReport
} from '../controllers/reports.controller'
import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'

import {
  MANAGEMENT_MENU
} from '../constants/roles'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({
  roles: [MANAGEMENT_MENU]
}))
router
  .route('/marketing-report')
  .get(getMarketingReport)

router
  .route('/all-analysts')
  .get(getAllAnalysts)

router
  .route('/analysts-report')
  .get(getAnalystReport)

export default router
