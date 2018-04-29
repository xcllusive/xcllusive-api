import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import compress from 'compression'
import methodOverride from 'method-override'
import cors from 'cors'
import helmet from 'helmet'
import busboy from 'connect-busboy'
import busboyBodyParser from 'busboy-body-parser'

import routes from '../api/routes'
import { logs } from './vars'
import error from '../api/middlewares/error'

const app = express()

app.use(morgan(logs))
app.use(busboy())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(busboyBodyParser())
app.use(compress())
app.use(methodOverride())
app.use(helmet())
app.use(cors())
app.use('/', routes)
app.use(error.converter)
app.use(error.notFound)
app.use(error.handler)

module.exports = app
