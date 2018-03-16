const path = require('path')

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env')
})

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  mysql: {
    uri: process.env.NODE_ENV === 'development' ? process.env.MYSQL_URI_DEV : process.env.MYSQL_URI,
    database: process.env.NODE_ENV === 'development' ? process.env.MYSQL_DATABASE_DEV : process.env.MYSQL_DATABASE,
    user: process.env.NODE_ENV === 'development' ? process.env.MYSQL_USERNAME_DEV : process.env.MYSQL_USERNAME,
    password: process.env.NODE_ENV === 'development' ? process.env.MYSQL_PASSWORD_DEV : process.env.MYSQL_PASSWORD
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
}
