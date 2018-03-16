import { port, env } from './config/vars'
import app from './config/express'
import models from './config/sequelize'

models.sequelize.authenticate()
  .then(() => models.sequelize.sync())

  .then(() => {
    app.listen(port, () => console.info(`server started on port ${port} (${env})`))
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = app
