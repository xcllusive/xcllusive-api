'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('EmailTemplates', [
      {
        title: 'Agent assign to business',
        description: '',
        subject: '',
        body: '',
        handlebars:
          '["owner_first_name","agent_full_name","agent_first_name","agent_email","agent_desk_phone","agent_mobile"]'
      },
      {
        title: 'IM Approved',
        description: '',
        subject: '',
        body: '',
        handlebars: '["business_name","agent_name","agent_email"]'
      },
      {
        title: 'IM Rejected',
        description: '',
        subject: '',
        body: '',
        handlebars: '["business_name","agent_name","agent_email"]'
      },
      {
        title: 'IM Waiting for Manager’s Approval',
        description: '',
        subject: '',
        body: '',
        handlebars: '["business_name","agent_name","agent_email"]'
      },
      {
        title: 'IM Waiting for Owner’s Approval',
        description: '',
        subject: '',
        body: '',
        handlebars:
          '["business_name","business_owner_name,","business_owner_email", "business_owner_firstName"]'
      },
      {
        title: 'Request Owner Approval',
        description: '',
        subject: '',
        body: '',
        handlebars:
          '["buyer_name","buyer_phone","buyer_idl", "buyer_address", "owner_name"]'
      },
      {
        title: 'Send Business IM',
        description: '',
        subject: '',
        body: '',
        handlebars:
          '["buyer_name","business_name","agents_name","agents_phone","agents_email"]'
      },
      {
        title: 'Send CA',
        description: '',
        subject: '',
        body: '',
        handlebars: '["buyer_name","business_name"]'
      },
      {
        title: 'Send Email to Buyer',
        description: '',
        subject: '',
        body: '',
        handlebars: '["buyer_nane","buyers_contact_number","buyers_email"]'
      },
      {
        title: 'Send Enquiry to Owner',
        description: '',
        subject: '',
        body: '',
        handlebars: '["buyer_name","owners_name","business_name","buyer_id"]'
      },
      {
        title: 'Score Email',
        description: '',
        subject: '',
        body: '',
        handlebars: '["owners_name"]'
      }
    ])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('EmailTemplates')
  }
}
