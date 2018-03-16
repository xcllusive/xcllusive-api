import express from 'express'

import authRoutes from './auth.route'
import userRoutes from './user.route'
import businessRoutes from './business.route'
import businessRegisterRoutes from './businessRegister.route'
import businessLogRoutes from './businessLog.route'

const router = express.Router()

router.get('/', (req, res) => res.send('API is working !'))
router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/business', businessRoutes)
router.use('/business-register', businessRegisterRoutes)
router.use('/business-log', businessLogRoutes)

module.exports = router
