import path from 'path'

if (process.env.NODE_ENV === 'development-local') {
  require('dotenv-safe').load({
    path: path.join(__dirname, '../../.env')
  })
}

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_HOURS,
  mysql: {
    uri: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'development-local' ? process.env.MYSQL_URI_DEV : process.env.MYSQL_URI,
    database: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'development-local' ? process.env.MYSQL_DATABASE_DEV : process.env.MYSQL_DATABASE,
    user: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'development-local' ? process.env.MYSQL_USERNAME_DEV : process.env.MYSQL_USERNAME,
    password: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'development-local' ? process.env.MYSQL_PASSWORD_DEV : process.env.MYSQL_PASSWORD
  },
  mail: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  awsSNS: {
    snsTopicARN: process.env.SNS_TOPIC_ARN
  }
}
