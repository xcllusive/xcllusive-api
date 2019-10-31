const path = require('path')

if (process.env.NODE_ENV === 'development') {
  require('dotenv-safe').load({
    path: path.join(__dirname, '../../../.env')
  })
}

module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME_DEV,
    password: process.env.MYSQL_PASSWORD_DEV,
    database: process.env.MYSQL_DATABASE_DEV,
    host: process.env.MYSQL_URI_DEV,
    dialect: 'mysql'
  },
  production: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_URI,
    dialect: 'mysql'
  }
}
