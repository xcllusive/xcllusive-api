'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('BusinessStages', [
      {
        id: 1,
        label: 'For Sale'
      },
      {
        id: 2,
        label: 'Under Offer'
      }
    ])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('BusinessStages')
  }
}
