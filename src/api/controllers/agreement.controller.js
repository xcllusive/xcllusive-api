import util from 'util'
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import numeral from 'numeral'
import handlebars from 'handlebars'
import puppeteer from 'puppeteer'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'
import mailer from '../modules/mailer'

export const get = async (req, res, next) => {
  const { idAgreement: id } = req.params

  try {
    const agreement = await models.Agreement.findOne({ where: { id } })

    return res.status(201).json({
      data: agreement,
      message: 'Template get with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const generate = async (req, res, next) => {
  const { body, businessId } = req.body
  const newAgreement = {
    createdBy_id: req.user.id,
    body
  }

  try {
    const getBusiness = await models.Business.findOne({
      where: { id: businessId }
    })

    if (!getBusiness) {
      throw new APIError({
        message: 'Business not found',
        status: 400,
        isPublic: true
      })
    }

    const destPdfGeneratedAgreement = path.resolve(
      'src',
      'api',
      'resources',
      'pdf',
      'generated',
      'agreement',
      `${Date.now()}.pdf`
    )

    const PDF_OPTIONS = {
      path: destPdfGeneratedAgreement,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        left: '15mm',
        right: '15mm',
        bottom: '15mm'
      },
      displayHeaderFooter: true,
      headerTemplate: ' ',
      footerTemplate: `
      <div style="margin-left:15mm;margin-right:15mm;width:100%;font-size:12px;text-align:center;color:rgb(187, 187, 187);">
      <span style="float: left;"></span>
      <span style="float: right;">Page: <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>`
    }

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.emulateMedia('screen')
    await page.goto(`data:text/html,${newAgreement.body}`)

    await page.pdf(PDF_OPTIONS)
    await browser.close()

    if (getBusiness.agreement_id) {
      await models.Agreement.update(newAgreement, {
        where: {
          id: getBusiness.agreement_id
        }
      })
    } else {
      const agreement = await models.Agreement.create(newAgreement)

      await models.Business.update(
        { agreement_id: agreement.id },
        {
          where: {
            id: businessId
          }
        }
      )
    }

    return res.download(destPdfGeneratedAgreement, err => {
      // fs.unlink(destPdfGeneratedAgreement)
      if (err) {
        throw new APIError({
          message: 'Error on send pdf',
          status: 500,
          isPublic: true
        })
      }
    })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { idAgreement: id } = req.params
  const editAgreement = req.body

  editAgreement.modifiedBy_id = req.user.id

  try {
    const agreement = await models.Agreement.findOne({ where: { id } })

    if (!agreement) {
      throw new APIError({
        message: 'Agreement not found',
        status: 400,
        isPublic: true
      })
    }

    const updatedAgreement = await models.Agreement.update(editAgreement, {
      where: { id }
    })

    return res.status(201).json({
      data: updatedAgreement,
      message: 'Template updated with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const sendEmail = async (req, res, next) => {
  const { body, businessId } = req.body
  const attachment = req.files.attachment
  const mail = JSON.parse(req.body.mail)

  const attachments = []

  const destPdfGeneratedAgreement = path.resolve(
    'src',
    'api',
    'resources',
    'pdf',
    'generated',
    'agreement',
    `${Date.now()}.pdf`
  )

  const templatepath = path.resolve(
    'src',
    'api',
    'resources',
    'pdf',
    'templates',
    'invoice',
    'invoice.html'
  )

  const destPdfGeneratedInvoice = path.resolve(
    'src',
    'api',
    'resources',
    'pdf',
    'generated',
    'invoice',
    `${Date.now()}.pdf`
  )

  // Verify file is pdf
  if (attachment && !/\/pdf$/.test(attachment.mimetype)) {
    throw new APIError({
      message: 'Expect pdf file',
      status: 400,
      isPublic: true
    })
  }

  const newAgreement = {
    createdBy_id: req.user.id,
    body
  }

  let invoice = null

  try {
    const getBusiness = await models.Business.findOne({
      where: { id: businessId }
    })

    if (!getBusiness) {
      throw new APIError({
        message: 'Business not found',
        status: 400,
        isPublic: true
      })
    }

    if (getBusiness.agreement_id) {
      await models.Agreement.update(newAgreement, {
        where: {
          id: getBusiness.agreement_id
        }
      })
    } else {
      const agreement = await models.Agreement.create(newAgreement)

      await models.Business.update(
        { agreement_id: agreement.id },
        {
          where: {
            id: businessId
          }
        }
      )
    }

    if (mail.attachInvoice) {
      const readFile = util.promisify(fs.readFile)

      // Verify exists score
      invoice = await models.Invoice.findOne({
        where: {
          business_id: businessId
        },
        order: [['dateTimeCreated', 'DESC']]
      })

      if (!invoice) {
        throw new APIError({
          message: 'Invoice not found',
          status: 404,
          isPublic: true
        })
      }

      const context = {
        ref: invoice.ref,
        officeDetails: invoice.officeDetails,
        bankDetails: invoice.bankDetails,
        to: invoice.to,
        description: invoice.description,
        amount: numeral(invoice.amount).format('0,0.00'),
        total: numeral(invoice.total).format('0,0.00'),
        gst: numeral((invoice.amount * 10) / 100).format('0,0.00'),
        payment_terms: invoice.paymentTerms,
        created: moment(invoice.dateTimeCreated).format('LL')
      }

      const PDF_OPTIONS = {
        path: destPdfGeneratedInvoice,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '15mm',
          left: '15mm',
          right: '15mm',
          bottom: '15mm'
        },
        displayHeaderFooter: false,
        headerTemplate: ' ',
        footerTemplate: `
      <div style="margin-left:15mm;margin-right:15mm;width:100%;font-size:12px;text-align:center;color:rgb(187, 187, 187);">
      <span style="float: left;"></span>
      <span style="float: right;">Page: <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>`,
        scale: 0.8
      }

      const content = await readFile(templatepath, 'utf8')
      const handlebarsCompiled = handlebars.compile(content)
      const template = handlebarsCompiled(context)
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.emulateMedia('screen')
      await page.goto(`data:text/html,${template}`)

      await page.pdf(PDF_OPTIONS)
      await browser.close()

      attachments.push({
        filename: mail.attachmentInvoice,
        path: destPdfGeneratedInvoice
      })
    }

    const PDF_OPTIONS = {
      path: destPdfGeneratedAgreement,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        left: '15mm',
        right: '15mm',
        bottom: '15mm'
      },
      displayHeaderFooter: true,
      headerTemplate: ' ',
      footerTemplate: `
      <div style="margin-left:15mm;margin-right:15mm;width:100%;font-size:12px;text-align:center;color:rgb(187, 187, 187);">
      <span style="float: left;"></span>
      <span style="float: right;">Page: <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>`
    }

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.emulateMedia('screen')
    await page.goto(`data:text/html,${newAgreement.body}`)

    await page.pdf(PDF_OPTIONS)
    await browser.close()

    const broker = await models.User.findOne({
      where: { id: getBusiness.listingAgent_id }
    })

    // Compile the template to use variables
    const templateCompiled = handlebars.compile(mail.body)
    const context = {
      business_name: getBusiness.businessName,
      owner_full_name: `${getBusiness.firstNameV} ${getBusiness.lastNameV}`,
      broker_full_name: `${broker.firstName} ${broker.lastName}`,
      broker_email: broker.email,
      broker_phone: broker.phoneHome,
      broker_mobile: broker.phoneMobile,
      broker_address: `${broker.street}, ${broker.suburb} - ${broker.state} - ${
        broker.postCode
      }`
    }

    attachments.push({
      filename: mail.attachmentAgreement,
      path: destPdfGeneratedAgreement
    })

    if (attachment) {
      attachments.push({
        filename: attachment.name,
        content: attachment.data
      })
    }

    const mailOptions = {
      to: mail.to,
      from: '"Xcllusive" <businessinfo@xcllusive.com.au>',
      subject: mail.subject,
      html: templateCompiled(context),
      replyTo: broker.email,
      attachments
    }

    // Send Email
    const responseMailer = await mailer.sendMail(mailOptions)

    // remove pdf temp
    await fs.unlink(destPdfGeneratedAgreement, err => {
      if (err) {
        throw new APIError({
          message: 'Error on send email',
          status: 500,
          isPublic: true
        })
      }
    })
    await fs.unlink(destPdfGeneratedInvoice, err => {
      if (err) {
        throw new APIError({
          message: 'Error on send email',
          status: 500,
          isPublic: true
        })
      }
    })

    if (mail.attachInvoice) {
      // Update Date sent
      await models.Invoice.update(
        { dateSent: moment() },
        {
          where: { id: invoice.id }
        }
      )
    }

    return res.status(201).json({
      data: responseMailer,
      message: 'Send email successfuly'
    })
  } catch (error) {
    return next(error)
  }
}

export const getEmailTemplate = async (req, res, next) => {
  const { idEmailTemplate: id } = req.params
  const { businessId } = req.query

  try {
    const getBusiness = await models.Business.findOne({
      where: { id: businessId }
    })

    if (!getBusiness) {
      throw new APIError({
        message: 'Business not found',
        status: 400,
        isPublic: true
      })
    }

    const template = await models.EmailTemplate.findOne({ where: { id } })

    const broker = await models.User.findOne({
      where: { id: getBusiness.listingAgent_id }
    })

    // Compile the template to use variables
    const templateCompiled = handlebars.compile(template.body)
    const context = {
      business_name: getBusiness.businessName,
      owner_full_name: getBusiness.listingAgent,
      broker_full_name: `${broker.firstName} ${broker.lastName}`,
      broker_email: broker.email,
      broker_phone: broker.phoneHome,
      broker_mobile: broker.phoneMobile,
      broker_address: `${broker.street}, ${broker.suburb} - ${broker.state} - ${
        broker.postCode
      }`
    }

    return res.status(201).json({
      data: {
        subject: template.subject,
        body: templateCompiled(context)
      },
      message: 'Template get with success'
    })
  } catch (error) {
    return next(error)
  }
}
