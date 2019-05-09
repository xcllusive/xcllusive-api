import express from 'express'

import authRoutes from './auth.route'
import userRoutes from './user.route'
import businessRoutes from './business.route'
import businessRegisterRoutes from './businessRegister.route'
import businessLogRoutes from './businessLog.route'
import buyerRoutes from './buyer.route'
import buyerRegisterRoutes from './buyerRegister.route'
import emailTemplateRoutes from './emailTemplate.route'
import scoreRoutes from './score.route'
import scoreRegisterRoutes from './scoreRegister.route'
import systemSettingsRoutes from './systemSettings.route'
import agreementTemplateRoutes from './agreementTemplate.route'
import agreementRoutes from './agreement.route'
import invoiceRoutes from './invoice.route'
import invoiceTemplateRoutes from './invoiceTemplate.route'
import appraisalRegisterRoutes from './appraisalRegister.route'
import appraisalRouter from './appraisal.route'
import comparableDataRoutes from './comparableData.route'
import reportsRoutes from './reports.route'
import officeRegisterRoutes from './officeRegister.route'

import ctcReportsRoutes from './CTC/reports.route'

const router = express.Router()

router.get('/', (req, res) => res.send('API is working !'))
router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/system-settings', systemSettingsRoutes)
router.use('/business', businessRoutes)
router.use('/business-register', businessRegisterRoutes)
router.use('/business-log', businessLogRoutes)
router.use('/buyer', buyerRoutes)
router.use('/buyer-register', buyerRegisterRoutes)
router.use('/email-template', emailTemplateRoutes)
router.use('/score', scoreRoutes)
router.use('/score-register', scoreRegisterRoutes)
router.use('/agreement-template', agreementTemplateRoutes)
router.use('/agreement', agreementRoutes)
router.use('/invoice', invoiceRoutes)
router.use('/invoice-template', invoiceTemplateRoutes)
router.use('/appraisal-register', appraisalRegisterRoutes)
router.use('/appraisal', appraisalRouter)
router.use('/comparable-data', comparableDataRoutes)
router.use('/reports', reportsRoutes)
router.use('/office-register', officeRegisterRoutes)

/* CTC Routes */
router.use('/ctc-reports', ctcReportsRoutes)

export default router
