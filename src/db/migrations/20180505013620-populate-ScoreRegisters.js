'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ScoreRegisters', [
      {
        type: 'perceivedPrice',
        label: 'Right Price',
        textReport: 'Buyers have reported that the business is priced very well.',
        weight: '90'
      },
      {
        type: 'perceivedPrice',
        label: 'Resonable',
        textReport: 'Buyers feel that the business is reasonably priced.',
        weight: '60'
      },
      {
        type: 'perceivedPrice',
        label: 'Not enough feedback',
        textReport:
          'Currently there has not been enough buyer feedback to draw any conclusions on price.',
        weight: '50'
      },
      {
        type: 'perceivedPrice',
        label: 'On the high side',
        textReport:
          'Buyers feel that the price for the business is a somewhat higher than they would be willing to pay.',
        weight: '40'
      },
      {
        type: 'perceivedPrice',
        label: 'Overpriced',
        textReport: 'Buyers feel that the business is overpriced.',
        weight: '20'
      },
      {
        type: 'perceivedPrice',
        label: 'Way overpriced',
        textReport:
          'Buyers are reporting that they see the business as being extremely overpriced.',
        weight: '10'
      },
      {
        type: 'infoTransMomen',
        label: 'All info available, Owner Co-operative and quick with info',
        textReport:
          'Based on feedback from purchasers who have looked at the business, they are very satisfied in terms of co-operation, availability and quality of documents.',
        weight: '90'
      },
      {
        type: 'infoTransMomen',
        label: 'All info available but delayed in producing',
        textReport:
          'Buyers are pleased with the information that is available, but feel that there are unnecessary delays when new information is requested.',
        weight: '70'
      },
      {
        type: 'infoTransMomen',
        label: 'Some info available but not up to date.',
        textReport:
          'Buyers have reported that despite having some information, it is not up to date which is affecting their ability to get a clear idea of how the business is performing.',
        weight: '50'
      },
      {
        type: 'infoTransMomen',
        label:
          'Tax returns available, but cash on top. Owner co-operative and cash records available.',
        textReport:
          'Buyers have indicated that they are concerned about the level of non-recorded income in the business, but they are happy with the owner’s level of corporation.',
        weight: '40'
      },
      {
        type: 'infoTransMomen',
        label: 'Tax Returns Available - No Proof of Cash',
        textReport:
          'Buyers have expressed that they have concerns about the amount of non-recorded income that cannot be proven.',
        weight: '30'
      },
      {
        type: 'infoTransMomen',
        label: 'Basic information available only.',
        textReport:
          'Based on feedback from purchasers, it seems that they are looking for more detailed financial information than is currently available.',
        weight: '25'
      },
      {
        type: 'infoTransMomen',
        label: 'Basic information available only, owner difficult to work with',
        textReport:
          'Based on feedback from purchasers that have looked at the business, it appears that Information is slow-coming and hard to obtain.',
        weight: '20'
      },
      {
        type: 'infoTransMomen',
        label: 'Crucial info missing owner not co-operative',
        textReport:
          'Buyers have reported being very concerned with the lack of information, availability of documents or the owner’s transparency, and that there is not enough information available ',
        weight: '10'
      },
      {
        type: 'currentInterest',
        label: 'Buyer Found',
        textReport: 'A buyer has been found for this business.',
        weight: '90'
      },
      {
        type: 'currentInterest',
        label: 'Negotiation the price with Multiple Buyers',
        textReport: 'Currently in price negotiations with multiple buyers.',
        weight: '80'
      },
      {
        type: 'currentInterest',
        label: 'Several Interested Buyers asking for further information',
        textReport: 'There are currently multiple seriously interested buyers.',
        weight: '70'
      },
      {
        type: 'currentInterest',
        label: 'Negotiating the price with only one buyer',
        textReport: 'Currently in price negotiations with one buyer.',
        weight: '60'
      },
      {
        type: 'currentInterest',
        label: 'Only one buyer with serious interest',
        textReport: 'There is currently one buyer who is seriously interested.',
        weight: '50'
      },
      {
        type: 'currentInterest',
        label: 'Ongoing initial meetings with buyers',
        textReport:
          'Buyers are showing continued interest and moving forward into the meeting stage.',
        weight: '40'
      },
      {
        type: 'currentInterest',
        label: 'Some Interest',
        textReport: 'Currently, there is some interest in the business.',
        weight: '30'
      },
      {
        type: 'currentInterest',
        label: 'Limited Interest',
        textReport: 'Currently, there is limited interest in the business.',
        weight: '20'
      },
      {
        type: 'currentInterest',
        label: 'No interest',
        textReport: 'Currently, the business is not attracting potential buyers.',
        weight: '10'
      },
      {
        type: 'perceivedRisk',
        label: 'Very secure business',
        textReport:
          'Buyers see this business as an extremely secure and high performing business',
        weight: '90'
      },
      {
        type: 'perceivedRisk',
        label: 'Above average security of profits',
        textReport:
          'Based on buyers’ feedback, buyers see this as an above average and  secure business.',
        weight: '60'
      },
      {
        type: 'perceivedRisk',
        label: 'Reasonable Security of the profits',
        textReport:
          'Buyers perceive this business as having reasonable risk associated with it.',
        weight: '50'
      },
      {
        type: 'perceivedRisk',
        label: 'Buyers concerned with aspects of the business',
        textReport: 'Buyers have expressed concerns with some aspects of the business.',
        weight: '30'
      },
      {
        type: 'perceivedRisk',
        label: 'Good Business- Risky industry',
        textReport:
          'Though buyers report that they like the way the business is structured, they perceive the industry of the business as having high risk.',
        weight: '30'
      },
      {
        type: 'perceivedRisk',
        label: 'High Risk Industry',
        textReport:
          'Buyers have reported that they see the industry as being very risky and uncertain.',
        weight: '20'
      },
      {
        type: 'perceivedRisk',
        label: 'Big issue with a business',
        textReport:
          'Buyers have expressed serious concerns with specific aspects of the business.',
        weight: '10'
      },
      {
        type: 'enquiries',
        label: '4',
        textReport:
          'This business has received four (or greater than four) more enquiries than the average business has received over the past four weeks.',
        weight: '90'
      },
      {
        type: 'enquiries',
        label: '3',
        textReport:
          'This business has received three more enquiries than the average business has received over the past four weeks.',
        weight: '80'
      },
      {
        type: 'enquiries',
        label: '2',
        textReport:
          'This business has received two more enquiries than the average business has received over the past four weeks.',
        weight: '70'
      },
      {
        type: 'enquiries',
        label: '1',
        textReport:
          'This business has received one more enquiry than the average business has received over the past four weeks.',
        weight: '60'
      },
      {
        type: 'enquiries',
        label: '0',
        textReport:
          'This business has matched the average number of enquiries for all businesses over the past four weeks.',
        weight: '50'
      },
      {
        type: 'enquiries',
        label: '-1',
        textReport:
          'This business has received one less enquiry than the average business has received over the past four weeks.',
        weight: '40'
      },
      {
        type: 'enquiries',
        label: '-2',
        textReport:
          'This business has received two less enquiries than the average business has received over the past four weeks.',
        weight: '30'
      },
      {
        type: 'enquiries',
        label: '-3',
        textReport:
          'This business has received three less enquiries than the average business has received over the past four weeks.',
        weight: '20'
      },
      {
        type: 'enquiries',
        label: '-4',
        textReport:
          'This business has received four or less enquiries than the average business has received over the past four weeks.',
        weight: '10'
      }
    ])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ScoreRegisters')
  }
}
