import express from 'express'
import validate from 'express-validation'

import {
  list,
  create,
  update,
  remove,
  getBusiness,
  updateListingAgent,
  enquiryBusiness,
  emailToBuyer,
  sendEnquiryOwner,
  getBuyersFromBusiness,
  getGroupEmail
} from '../controllers/business.controller'

import { BUSINESS_MENU } from '../constants/roles'

import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'

import * as validation from '../validations/business.validation'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [BUSINESS_MENU] }))

router.route('/:idBusiness/group-email').get(validate(validation.getGroupEmail), getGroupEmail)

router.route('/:idBusiness/buyer').get(getBuyersFromBusiness)

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

export default router
