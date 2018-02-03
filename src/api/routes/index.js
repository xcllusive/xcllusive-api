import express from 'express'

import authRoutes from './auth.route'
import userRoutes from './user.route'

const router = express.Router()

router.get('/', (req, res) => res.send('OK'))
router.use('/auth', authRoutes)
router.use('/users', userRoutes)

module.exports = router
