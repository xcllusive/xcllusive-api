'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('BusinessProducts', [
      {
        id: 1,
        label: 'Business Sale'
      },
      {
        id: 2,
        label: 'Seller Assist'
      },
      {
        id: 3,
        label: 'Franchise Sale'
      }
    ])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('BusinessProducts')
  }
}
