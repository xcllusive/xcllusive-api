import path from 'path'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import inlineBase64 from 'nodemailer-plugin-inline-base64'

import { mail } from '../../config/vars'

const transport = nodemailer.createTransport({
  host: mail.host,
  port: mail.port,
  auth: { user: mail.user, pass: mail.pass }
})

transport.use(
  'compile',
  hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/api/resources/mail/templates'),
    extName: '.html'
  })
)

transport.use('compile', inlineBase64({ cidPrefix: 'xcllusive_img' }))

export default transport
