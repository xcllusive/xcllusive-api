import express from 'express'
import validate from 'express-validation'

import {
  list,
  create,
  update,
  remove,
  getBusiness,
  updateListingAgent,
  updateStageLost,
  enquiryBusiness,
  emailToBuyer,
  sendEnquiryOwner,
  getBuyersFromBusiness,
  getGroupEmail,
  sendGroupEmail,
  getStageSold,
  createStageSold,
  updateStageSold,
  finaliseStageSold,
  getQtdeBusinessStageUser,
  getAllPerUser,
  updateStageMemo,
  uploadIM,
  verifyDuplicatedBusiness,
  getCtcAllPerUser,
  getCtcQtdeBusinessStageUser,
  sendSms,
  sendEmailToCtcBusiness,
  verifyBusinessFirstOpenByAgent,
  getAllEnquiries,
  addIssueToBusiness,
  removeIssueFromBusiness
} from '../controllers/business.controller'

import {
  BUSINESS_MENU
} from '../constants/roles'

import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'

import * as validation from '../validations/business.validation'
import {
  controlActivityUser
} from '../middlewares/controlActivity'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({
  roles: [BUSINESS_MENU]
}))

router.use(controlActivityUser('Business'))

router.route('/issue').put(addIssueToBusiness).delete(removeIssueFromBusiness)

router.route('/show-enquiries').get(getAllEnquiries)

router.route('/upload-im').post(validate(validation.uploadedIM), uploadIM)

router.route('/duplicated-business').get(verifyDuplicatedBusiness)

router.route('/:idBusiness/stage-sales-memo').put(updateStageMemo)

router.route('/qtde-business-stage-user').get(getQtdeBusinessStageUser)
router.route('/ctc-qtde-business-stage-user').get(getCtcQtdeBusinessStageUser)

router.route('/businesses-user').get(getAllPerUser)
router.route('/ctc-businesses-user').get(getCtcAllPerUser)

router
  .route('/:idBusiness/group-email')
  .get(validate(validation.getGroupEmail), getGroupEmail)

router.route('/:idBusiness/buyer').get(getBuyersFromBusiness)

router.route('/:idBusiness/stage-lost').put(updateStageLost)

router
  .route('/:idBusiness/sold')
  .get(getStageSold)
  .post(createStageSold)

router.route('/:idBusiness/sold/:idSold').put(updateStageSold)

router.route('/:idBusiness/sold/:idSold/finalise').post(finaliseStageSold)

router
  .route('/')
  .get(list)
  .post(create)

router
  .route('/:idBusiness')
  .get(getBusiness)
  .put(update)
  .delete(remove)

router.route('/listing-agent/:idBusiness').put(updateListingAgent)

router.route('/enquiry-business').post(enquiryBusiness)

router.route('/email-to-buyer').post(emailToBuyer)

router.route('/send-enquiry-owner').post(sendEnquiryOwner)

router.route('/send-group-email').post(sendGroupEmail)

router.route('/send-email-ctc-business').post(sendEmailToCtcBusiness)

router.route('/send-sms').post(sendSms)

router.route('/:idBusiness/verify-first-open-by-agent').put(verifyBusinessFirstOpenByAgent)

export default router
