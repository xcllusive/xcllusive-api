import Path from 'path'
import fs from 'fs'
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

export const create = async (req, res, next) => {
  const { body, businessId } = req.body

  const newAgreement = {
    createdBy_id: req.user.id,
    body
  }

  try {
    const getBusiness = await models.Business.findOne({
      where: { id: businessId}
    })

    if (!getBusiness) {
      throw new APIError({
        message: 'Business not found',
        status: 400,
        isPublic: true
      })
    }

    const agreement = await models.Agreement.create(newAgreement)

    await models.Business.update({ agreement_id: agreement.id }, {
      where: {
        id: businessId
      }
    })

    const destPdfGenerated = Path.resolve(
      'src',
      'api',
      'resources',
      'pdf',
      'generated',
      'agreement',
      `${Date.now()}.pdf`
    )

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

    // const file = fs.createReadStream(destPdfGenerated)
    // const stat = fs.statSync(destPdfGenerated)
    // res.setHeader('Content-Length', stat.size)
    // res.setHeader('Content-Type', 'application/pdf')
    // res.setHeader('Content-Disposition', 'attachment; filename=Agreement.pdf')
    // file.pipe(res)

    return res.download(destPdfGenerated, function (err) {
      if (err) {
        console.log('Error')
        console.log(err)
      } else {
        console.log('Success')
      }
    })
    // return res.status(201).sendFile(destPdfGenerated)
  } catch (error) {
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

  try {
    const getBusiness = await models.Business.findOne({
      where: { id: businessId}
    })

    if (!getBusiness) {
      throw new APIError({
        message: 'Business not found',
        status: 400,
        isPublic: true
      })
    }

    const agreement = await models.Agreement.create(newAgreement)

    await models.Business.update({ agreement_id: agreement.id }, {
      where: {
        id: businessId
      }
    })

    const destPdfGenerated = Path.resolve(
      'src',
      'api',
      'resources',
      'pdf',
      'generated',
      'agreement',
      `${Date.now()}.pdf`
    )

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
      where: { id: getBusiness.brokerAccountName }
    })

    // Compile the template to use variables
    const templateCompiled = handlebars.compile(mail.body)
    const context = {
      business_name: getBusiness.businessName,
      owner_full_name: getBusiness.listingAgent,
      broker_full_name: `${broker.firstName} ${broker.lastName}`,
      broker_email: broker.email,
      broker_phone: broker.phoneHome,
      broker_mobile: broker.phoneMobile,
      broker_address: `${broker.street}, ${broker.suburb} - ${broker.state} - ${broker.postCode}`
    }

    attachments.push({
      filename: mail.attachment,
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
      html: templateCompiled(context),
      replyTo: broker.email,
      attachments
    }

    // Send Email
    const responseMailer = await mailer.sendMail(mailOptions)

    // remove pdf temp
    await fs.unlink(destPdfGenerated)

    return res.status(201).json({
      data: responseMailer,
      message: 'Send email successfuly'
    })
  } catch (error) {
    return next(error)
  }
}
