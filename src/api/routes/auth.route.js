import express from 'express'
import validate from 'express-validation'

import validation from '../validations/auth.validation'

import {
  login,
  loginWithToken,
  logout
} from '../controllers/auth.controller'
import {
  controlActivityUser
} from '../middlewares/controlActivity'

import {
  authMiddleware
} from '../middlewares/auth'

const router = express.Router()

router.route('/logout').post(logout)

router
  .route('/login')
  .post(validate(validation.login), login)

router
  .route('/loginWithToken')
  .get(authMiddleware, loginWithToken)

module.exports = router
