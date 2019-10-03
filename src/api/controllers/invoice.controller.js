import numeral from 'numeral'
import moment from 'moment'
import puppeteer from 'puppeteer'
import handlebars from 'handlebars'
import util from 'util'
import fs from 'fs'
import path from 'path'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'
import mailer from '../modules/mailer'

export const get = async (req, res, next) => {
  const {
    idInvoice: id
  } = req.params

  try {
    const invoice = await models.Invoice.findOne({
      where: {
        id
      }
    })

    return res.status(201).json({
      data: invoice,
      message: 'Invoice get with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const getLast = async (req, res, next) => {
  const {
    businessId
  } = req.query

  try {
    const invoice = await models.Invoice.findOne({
      where: {
        business_id: businessId
      },
      order: [
        ['dateTimeCreated', 'DESC']
      ]
    })
    return res.status(201).json({
      data: invoice,
      message: 'Get last invoice with succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const list = async (req, res, next) => {
  const {
    limit,
    businessId
  } = req.query
  const offset = req.skip

  try {
    const invoices = await models.Invoice.findAndCountAll({
      where: {
        business_id: businessId
      },
      order: [
        ['dateTimeCreated', 'DESC']
      ],
      limit,
      offset
    })

    return res.status(201).json({
      data: invoices,
      pageCount: invoices.count,
      itemCount: Math.ceil(invoices.count / req.query.limit),
      message: 'List invoices with succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const {
    invoice,
    businessId
  } = req.body

  invoice.createdBy_id = req.user.id
  invoice.modifiedBy_id = req.user.id

  try {
    // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: businessId
      }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Get number of invoices
    const invoices = await models.Invoice.findAndCountAll({
      where: {
        business_id: businessId
      }
    })

    invoice.business_id = business.id
    invoice.ref = `${business.id}${business.businessName
      .substring(0, 3)
      .replace(/\s/g, '')
      .toUpperCase()}${invoices.count + 1}`

    const invoiceCreated = await models.Invoice.create(invoice)

    const updateInvoice = {
      lastInvoice_id: invoiceCreated.id
    }
    await models.Business.update(
      updateInvoice, {
        where: {
          id: businessId
        }
      }
    )

    return res.status(201).json({
      data: invoiceCreated,
      message: 'Invoice created with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const {
    idInvoice: id
  } = req.params
  const editInvoice = req.body

  editInvoice.modifiedBy_id = req.user.id

  try {
    const editedInvoice = await models.Invoice.update(editInvoice, {
      where: {
        id
      }
    })

    return res.status(201).json({
      data: editedInvoice,
      message: 'Invoice updated with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const {
    idInvoice: id
  } = req.params

  try {
    await models.Invoice.destroy({
      where: {
        id
      }
    })

    return res.status(200).json({
      message: `Invoice ${id} removed with success`
    })
  } catch (error) {
    return next(error)
  }
}

export const makePdf = async (req, res, next) => {
  const {
    idInvoice
  } = req.params

  const templatePath = path.resolve(
    'src',
    'api',
    'resources',
    'pdf',
    'templates',
    'invoice',
    'invoice.html'
  )

  const destPdfGenerated = path.resolve(
    'src',
    'api',
    'resources',
    'pdf',
    'generated',
    'invoice',
    `${Date.now()}.pdf`
  )

  const readFile = util.promisify(fs.readFile)

  try {
    // Verify exists score
    const invoice = await models.Invoice.findOne({
      where: {
        id: idInvoice
      },
      include: [{
        model: models.Business,
        as: 'Business'
      }]
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
      path: destPdfGenerated,
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

    const content = await readFile(templatePath, 'utf8')
    const handlebarsCompiled = handlebars.compile(content)
    const template = handlebarsCompiled(context)
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    // const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.emulateMedia('screen')
    // await page.goto(`data:text/html,${template}`)
    await page.setContent(template)

    await page.pdf(PDF_OPTIONS)
    await browser.close()

    return res.download(destPdfGenerated, err => {
      console.log(err)
      fs.unlink(destPdfGenerated, error => {
        if (error) {
          throw new APIError({
            message: 'Error on send pdf',
            status: 500,
            isPublic: true
          })
        }
      })
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

export const sendEmail = async (req, res, next) => {
  const {
    invoiceId,
    mail
  } = req.body
  const attachment = req.files.attachment

  const attachments = []

  // Verify file is pdf
  if (attachment && !/\/pdf$/.test(attachment.mimetype)) {
    throw new APIError({
      message: 'Expect pdf file',
      status: 400,
      isPublic: true
    })
  }

  const templatePath = path.resolve(
    'src',
    'api',
    'resources',
    'pdf',
    'templates',
    'invoice',
    'invoice.html'
  )
  const destPdfGenerated = path.resolve(
    'src',
    'api',
    'resources',
    'pdf',
    'generated',
    'invoice',
    `${Date.now()}.pdf`
  )

  // const destPdfGeneratedAgreement = path.resolve(
  //   'src',
  //   'api',
  //   'resources',
  //   'pdf',
  //   'generated',
  //   'agreement',
  //   `${Date.now()}.pdf`
  // )

  const readFile = util.promisify(fs.readFile)

  try {
    // Verify exists score
    const invoice = await models.Invoice.findOne({
      where: {
        id: invoiceId
      },
      include: [{
        model: models.Business,
        as: 'Business'
      }]
    })

    if (!invoice) {
      throw new APIError({
        message: 'Invoice not found',
        status: 404,
        isPublic: true
      })
    }

    const broker = await models.User.findOne({
      where: {
        id: invoice.Business.brokerAccountName
      }
    })

    // Agreement
    // if (mail.attachAgreement) {
    //   const agreement = await models.Agreement.findOne({
    //     where: { id: invoice.Business.agreement_id }
    //   })

    //   const PDF_OPTIONS = {
    //     path: destPdfGeneratedAgreement,
    //     format: 'A4',
    //     printBackground: true,
    //     margin: {
    //       top: '15mm',
    //       left: '15mm',
    //       right: '15mm',
    //       bottom: '15mm'
    //     },
    //     displayHeaderFooter: true,
    //     headerTemplate: ' ',
    //     footerTemplate: `
    //     <div style="margin-left:15mm;margin-right:15mm;width:100%;font-size:12px;text-align:center;color:rgb(187, 187, 187);">
    //     <span style="float: left;"></span>
    //     <span style="float: right;">Page: <span class="pageNumber"></span> of <span class="totalPages"></span></span>
    //     </div>`
    //   }

    //   const browser = await puppeteer.launch({
    //     args: ['--no-sandbox', '--disable-setuid-sandbox']
    //   })
    //   const page = await browser.newPage()
    //   await page.emulateMedia('screen')
    //   await page.goto(`data:text/html,${agreement.body}`)

    //   await page.pdf(PDF_OPTIONS)
    //   await browser.close()

    //   attachments.push({
    //     filename: mail.attachmentAgreement,
    //     path: destPdfGeneratedAgreement
    //   })
    // }
    // End Agreement

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
      path: destPdfGenerated,
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

    const content = await readFile(templatePath, 'utf8')
    const handlebarsCompiled = handlebars.compile(content)
    const template = handlebarsCompiled(context)
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    await page.emulateMedia('screen')
    // await page.goto(`data:text/html,${template}`)
    await page.setContent(template)

    await page.pdf(PDF_OPTIONS)
    await browser.close()

    attachments.push({
      filename: mail.attachmentName,
      path: destPdfGenerated
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
      html: mail.body,
      replyTo: broker.email,
      attachments
    }

    // Send Email
    const responseMailer = await mailer.sendMail(mailOptions)

    // remove pdf temp
    await fs.unlink(destPdfGenerated, err => {
      if (err) {
        throw new APIError({
          message: 'Error on send email',
          status: 500,
          isPublic: true
        })
      }
    })

    // Update Date sent
    await models.Invoice.update({
      dateSent: moment()
    }, {
      where: {
        id: invoiceId
      }
    })

    return res.status(201).json({
      data: responseMailer,
      message: 'Send email successfully'
    })
  } catch (error) {
    return next(error)
  }
}
