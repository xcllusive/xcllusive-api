import express from 'express'

import authRoutes from './auth.route'
import userRoutes from './user.route'

const router = express.Router()

router.get('/', (req, res) => res.send('API is working !'))
router.use('/auth', authRoutes)
router.use('/user', userRoutes)

module.exports = router
