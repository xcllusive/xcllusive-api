import express from 'express'
import validate from 'express-validation'

import validation from '../validations/auth.validation'

import {
  login,
  loginWithToken
} from '../controllers/auth.controller'

import {
  authMiddleware
} from '../middlewares/auth'

const router = express.Router()

router
  .route('/login')
  .post(validate(validation.login), login)

router
  .route('/loginWithToken')
  .get(authMiddleware, loginWithToken)

module.exports = router
