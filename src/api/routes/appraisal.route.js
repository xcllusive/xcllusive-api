import express from 'express'

import {
  get,
  list,
  create,
  update,
  remove,
  generatePdf,
  moveFinancialYear,
  sendEmail,
  getEmailTemplateAppraisal,
  duplicate
} from '../controllers/appraisal.controller'

import {
  BUSINESS_MENU
} from '../constants/roles'

import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'
import {
  controlActivityUser
} from '../middlewares/controlActivity'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({
  roles: [BUSINESS_MENU]
}))

router.use(controlActivityUser('Business'))

router.route('/email-template').get(getEmailTemplateAppraisal)

router.route('/duplicate/:appraisalId').post(duplicate)

router
  .route('/')
  .post(create)
  .get(list)

router
  .route('/:appraisalId')
  .get(get)
  .put(update)
  .delete(remove)

router.route('/:appraisalId/generate').post(generatePdf)

router.route('/:appraisalId/move-financial-year').put(moveFinancialYear)

router.route('/send-email').post(sendEmail)

export default router
