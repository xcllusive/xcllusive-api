import express from 'express'
// import validate from 'express-validation'
import { getMarketingReport } from '../../controllers/CTC/reports.controller'
import { authMiddleware, authorizeMiddleware } from '../../middlewares/auth'

import { MANAGEMENT_MENU } from '../../constants/roles'
import { controlActivityUser } from '../../middlewares/controlActivity'

const router = express.Router()

router.use(authMiddleware).use(
  authorizeMiddleware({
    roles: [MANAGEMENT_MENU]
  })
)

router.use(controlActivityUser('Management'))

router.route('/marketing-report').get(getMarketingReport)

export default router
