'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('BusinessStages', [
      {
        id: 1,
        label: 'Potential Listing'
      },
      {
        id: 2,
        label: 'Listing Negotiation'
      },
      {
        id: 3,
        label: 'Sales Memo'
      },
      {
        id: 4,
        label: 'For Sale'
      },
      {
        id: 5,
        label: 'Under Offer'
      },
      {
        id: 6,
        label: 'Sold'
      },
      {
        id: 7,
        label: 'Withdrawn'
      },
      {
        id: 8,
        label: 'Lost'
      },
      {
        id: 9,
        label: 'Appraisal'
      },
      {
        id: 10,
        label: 'Data Gathering'
      },
      {
        id: 11,
        label: 'Meeting'
      },
      {
        id: 12,
        label: 'Closing Stage'
      },
      {
        id: 13,
        label: 'Sold by Owner'
      },
      {
        id: 14,
        label: 'On Hold'
      }
    ])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('BusinessStages')
  }
}
