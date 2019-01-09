import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import compress from 'compression'
import methodOverride from 'method-override'
import cors from 'cors'
import helmet from 'helmet'
import busboy from 'connect-busboy'
import busboyBodyParser from 'busboy-body-parser'
import paginate from 'express-paginate'

import routes from '../api/routes'
import { logs } from './vars'
import {
  converter as errorConverter,
  notFound as errorNotFound,
  handler as errorHandler
} from '../api/middlewares/error'

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

const app = express()

app.use(morgan(logs))
app.use(busboy())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(busboyBodyParser())
app.use(compress())
app.use(methodOverride())
app.use(helmet())
app.use(cors(corsOptions))
app.use(paginate.middleware(10, 50))
app.use('/', routes)
app.use(errorConverter)
app.use(errorNotFound)
app.use(errorHandler)

module.exports = app
