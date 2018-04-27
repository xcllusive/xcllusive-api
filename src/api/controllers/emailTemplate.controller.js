import fs from 'fs'
import path from 'path'
import Handlebars from 'handlebars'
import models from '../../config/sequelize'
import mailer from '../modules/mailer'

export const create = async (req, res, next) => {
  const newTemplateEmail = req.body
  const nameFileTemplate = newTemplateEmail.title.replace(/\s/g, '-')
  const rootDirectoryEmailTemplate = path.resolve('./src/api/resources/mail/templates')

  newTemplateEmail.attachmentPath = 'http://brunodasilvalenga.com.br'
  newTemplateEmail.createdBy_id = req.user.id
  newTemplateEmail.modifiedBy_id = req.user.id

  try {
    await fs.writeFile(
      `${rootDirectoryEmailTemplate}/template-${nameFileTemplate}.html`,
      newTemplateEmail.body
    )
    const templateEmail = await models.EmailTemplate.create(newTemplateEmail)
    return res.status(201).json({
      data: templateEmail,
      message: 'Template email created with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const sendEmailTest = async (req, res, next) => {
  const newEmail = req.body

  try {
    const template = await models.EmailTemplate.findOne({
      where: { title: newEmail.template }
    })

    if (!template) {
      const err = {
        message: 'The email template not found',
        status: 404,
        isPublic: true
      }
      throw err
    }

    const templateCompiled = Handlebars.compile(template.body)

    const context = {
      firstName: 'Cayo'
    }

    const mailOptions = {
      to: newEmail.to,
      from: '"Xcllusive Test 👻" <businessinfo@xcllusive.com.au>',
      subject: 'Teste',
      html: templateCompiled(context)
    }

    const resMailer = await mailer.sendMail(mailOptions)

    return res.status(201).json({
      data: resMailer,
      message: 'Send email successfuly'
    })
  } catch (error) {
    return next(error)
  }
}
