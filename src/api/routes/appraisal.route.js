import express from 'express'

import {
  get,
  list,
  create,
  update,
  remove,
  generatePdf
} from '../controllers/appraisal.controller'

import { BUSINESS_MENU } from '../constants/roles'

import { authMiddleware, authorizeMiddleware } from '../middlewares/auth'

const router = express.Router()

router.use(authMiddleware).use(authorizeMiddleware({ roles: [BUSINESS_MENU] }))

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

export default router
