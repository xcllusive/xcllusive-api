'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@xcllusive.com',
      firstName: 'Administrator',
      lastName: 'Systems',
      password: '$2a$08$IlWsJiGTqu3xPFCSWXWqHeDwXbZW5ZRLEDzc8gW9PlyYqMpf/ikZG',
      userType: 'Admin',
      roles: '["BUYER_MENU","BUSINESS_MENU","PRESALE_MENU","RESOURCES_MENU","CLIENT_MANAGER_MENU","MANAGEMENT_MENU","SYSTEM_SETTINGS_MENU", "CTC_MENU"]'
    }])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  }
}
