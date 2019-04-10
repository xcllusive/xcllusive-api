import Handlebars from 'handlebars'
import moment from 'moment'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'
import mailer from '../modules/mailer'
import {
  uploadToS3
} from '../modules/aws'
import {
  transformQueryAndCleanNull
} from '../utils/sharedFunctionsObject'
import Sequelize from 'sequelize'

export const get = async (req, res, next) => {
  const {
    idBuyer: id
  } = req.params

  try {
    const buyer = await models.Buyer.findOne({
      where: {
        id
      },
      include: [models.BusinessSource]
    })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    const response = transformQueryAndCleanNull(buyer.toJSON())

    return res.status(201).json({
      data: response,
      message: 'Success'
    })
  } catch (error) {
    return next(error)
  }
}

export const list = async (req, res, next) => {
  let {
    search,
    perPage
  } = req.query
  let paramsSearch = [
    'surname', 'firstName', 'email', 'telephone1Number', 'telephone1', 'telephone2', 'telephone3', 'emailOptional'
  ]
  let whereOptions = {
    where: {}
  }

  if (search.substring(0, 1) === 'B' && search.substring(1, 2) > 0) {
    paramsSearch = ['id']
    search = search.replace(/B/g, '')
  }

  if (search && search.length > 0) {
    whereOptions.where = {}
    whereOptions.where.$or = []
    paramsSearch.map(item => {
      whereOptions.where.$or.push({
        [item]: {
          $like: `%${search}%`
        }
      })
    })
    whereOptions.where.$or.push(
      Sequelize.where(
        Sequelize.fn('concat', Sequelize.col('firstName'), ' ', Sequelize.col('surname')), {
          $like: `%${search}%`
        }
      )
    )
    // }
  }

  const options = {
    attributes: [
      'id', 'firstName', 'surname', 'email', 'streetName', 'telephone1Number', 'telephone1', 'telephone2', 'caSent', 'caReceived', 'suburb', 'state', 'source_id', 'postCode', 'priceFrom', 'priceTo', 'emailOptional', 'attachmentUrl', 'scanfilePath'
    ],
    limit: perPage
  }

  try {
    const buyers = await models.Buyer.findAll(Object.assign(options, whereOptions))
    return res.status(200).json({
      data: buyers,
      message: 'Success'
    })
  } catch (error) {
    return res.json({
      error: true,
      message: error
    })
  }
}

export const listBusiness = async (req, res, next) => {
  // let search = req.query.search
  let stageId = req.query.stageId
  let whereOptions = {
    where: {}
  }

  whereOptions.where.brokerAccountName = {
    $eq: req.user.id
  }

  if (stageId && stageId.length > 0) {
    if (parseInt(stageId)) {
      whereOptions.where.stageId = {
        $eq: `${stageId}`
      }
    } else {
      const arrayStageId = JSON.parse(stageId)
      whereOptions.where.stageId = {
        $or: arrayStageId
      }
    }
  }

  // if (search && search.length > 0) {
  //   if (search.includes('BS') || search.includes('bs')) {
  //     if (search.includes('BS')) search = search.replace(/BS/g, '')
  //     if (search.includes('bs')) search = search.replace(/bs/g, '')
  //     whereOptions.where.id = {
  //       $eq: search
  //     }
  //   } else {
  //     if (parseInt(search)) {
  //       whereOptions.where.listedPrice = {
  //         $lte: search * 1.1,
  //         $gte: search * 0.9
  //       }
  //     } else {
  //       whereOptions.where.$or = []
  //       whereOptions.where.$or.push(
  //         {
  //           businessName: {
  //             $like: `%${search}%`
  //           }
  //         },
  //         {
  //           firstNameV: {
  //             $like: `%${search}%`
  //           }
  //         },
  //         {
  //           lastNameV: {
  //             $like: `%${search}%`
  //           }
  //         },
  //         {
  //           suburb: {
  //             $like: `%${search}%`
  //           }
  //         },
  //         {
  //           searchNote: {
  //             $like: `%${search}%`
  //           }
  //         }
  //       )
  //     }
  //   }
  // }

  const options = {
    attributes: [
      'id', 'businessName', 'firstNameV', 'lastNameV', 'address1', 'industry', 'listedPrice', 'description', 'stageId', 'productId', 'industryId', 'suburb', 'state', 'postCode', 'typeId', 'notifyOwner', 'dateTimeCreated', 'daysOnTheMarket', 'vendorPhone1', 'imUrl'
    ],
    include: [models.BusinessStage, models.BusinessProduct]
  }

  try {
    const businesses = await models.Business.findAll(Object.assign(options, whereOptions))

    const response = await Promise.all(
      businesses.map(async business => {
        const buyers = await models.Buyer.findAndCountAll({
          raw: true,
          attributes: ['id'],
          where: {
            $or: [{
              caReceived: {
                $eq: 1
              }
            }, {
              scanfilePath: {
                $ne: ''
              }
            }]
          },
          include: [{
            attributes: ['buyer_id', 'business_id'],
            model: models.EnquiryBusinessBuyer,
            as: 'EnquiryBusinessBuyer',
            where: {
              business_id: business.id
            }
          }, {
            attributes: ['buyer_id', 'business_id'],
            model: models.BuyerLog,
            as: 'BuyerLog',
            where: {
              buyer_id: {
                $col: 'EnquiryBusinessBuyer.buyer_id'
              },
              business_id: business.id,
              followUp: {
                $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
              },
              followUpStatus: 'Pending'
            }
          }],
          group: [
            [{
              model: models.EnquiryBusinessBuyer,
              as: 'EnquiryBusinessBuyer'
            }, 'buyer_id']
          ]
        })
        const lastScore = await models.Score.findOne({
          where: {
            business_id: business.id
          },
          order: [
            ['dateTimeCreated', 'DESC']
          ]
        })
        const lastBrokerReport = await models.BrokerWeeklyReport.findOne({
          where: {
            business_id: business.id
          },
          order: [
            ['dateTimeCreated', 'DESC']
          ],
          raw: true
        })
        return {
          business,
          countFollowUpTask: buyers.rows.length,
          lastScore,
          lastBrokerReport
        }
      })
    )
    return res.status(200).json(response)
  } catch (err) {
    return next(err)
  }
  /* end test */

  // const businesses = await models.Business.findAll(Object.assign(options, whereOptions))

  // const buyersFromBusiness = await Promise.all(
  //   businesses.map(async business => {
  //     const enquiries = await models.EnquiryBusinessBuyer.findAll({
  //       where: { business_id: business.id },
  //       include: [
  //         {
  //           where: { $or: [{ caReceived: { $eq: 1 } }, { scanfilePath: { $ne: '' } }] },
  //           model: models.Buyer,
  //           as: 'Buyer'
  //         }
  //       ]
  //     })
  //     return {
  //       enquiries,
  //       business
  //     }
  //   })
  // )
  // // cayo

  // const response = await Promise.all(
  //   buyersFromBusiness.map(async obj => {
  //     const arrayLogsLength = await Promise.all(
  //       obj.enquiries.map(async enquiry => {
  //         const log = await models.BuyerLog.findAndCountAll({
  //           where: {
  //             buyer_id: enquiry.buyer_id,
  //             business_id: enquiry.business_id,
  //             followUpStatus: 'Pending',
  //             followUp: {
  //               $lte: moment().toDate()
  //             }
  //           },
  //           include: [
  //             {
  //               where: {
  //                 id: enquiry.buyer_id,
  //                 $or: [{ caReceived: { $eq: 1 } }, { scanfilePath: { $ne: '' } }]
  //               },
  //               model: models.Buyer,
  //               as: 'Buyer'
  //             }
  //           ],
  //           raw: true
  //         })
  //         return log.length
  //       })
  //     )
  //     const lastScore = await models.Score.findOne({
  //       where: {
  //         business_id: obj.business.id
  //       },
  //       order: [['dateTimeCreated', 'DESC']]
  //     })
  //     return {
  //       business: obj.business,
  //       // countFollowUpTask: _.sum(arrayLogsLength),
  //       countFollowUpTask: arrayLogsLength.length,
  //       lastScore
  //     }
  //   })
  // )
}

export const create = async (req, res, next) => {
  const newBuyer = req.body

  newBuyer.source_id = req.body.sourceId === '' ? null : req.body.sourceId
  newBuyer.createdBy_id = req.user.id
  newBuyer.modifiedBy_id = req.user.id

  try {
    const buyer = await models.Buyer.create(newBuyer)
    return res.status(201).json({
      data: buyer,
      message: 'Buyer created with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const {
    idBuyer
  } = req.params
  const modifyBuyer = req.body

  modifyBuyer.modifiedBy_id = req.user.id

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({
      where: {
        id: idBuyer
      }
    })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    await models.Buyer.update(modifyBuyer, {
      where: {
        id: idBuyer
      }
    })
    return res.status(201).json({
      data: modifyBuyer,
      message: 'Buyer updated with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const {
    id
  } = req.body
  try {
    await models.User.destroy({
      where: {
        id
      }
    })
    return res.status(200).json({
      message: 'User removed with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const sendCA = async (req, res, next) => {
  const {
    buyerId,
    businessId
  } = req.body

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({
      where: {
        id: buyerId
      }
    })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: businessId
      }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify business attach to buyer
    const enquiryBusinessBuyer = await models.EnquiryBusinessBuyer.findOne({
      where: {
        $and: {
          business_id: businessId,
          buyer_id: buyerId
        }
      }
    })

    if (!enquiryBusinessBuyer) {
      // Set on Enquiry table
      await models.EnquiryBusinessBuyer.create({
        buyer_id: buyer.id,
        business_id: business.id
      })
    }

    // Verify exists template CA Sent
    const template = await models.EmailTemplate.findOne({
      where: {
        id: 8
      }
    })
    if (!template) {
      throw new APIError({
        message: 'The email template not found',
        status: 404,
        isPublic: true
      })
    }

    // Compile the template to use variables
    const templateCompiled = Handlebars.compile(template.body)
    const context = {
      buyer_name: `${buyer.firstName} ${buyer.surname}`,
      business_name: business.businessName
    }

    // Set email options
    const mailOptions = {
      to: buyer.email,
      from: '"Xcllusive" <businessinfo@xcllusive.com.au>',
      subject: template.subject,
      html: templateCompiled(context),
      attachments: template.enableAttachment ? [{
        filename: `${template.title.trim()}.pdf`,
        path: template.attachmentPath
      }] : []
    }

    // Send Email
    const responseMailer = await mailer.sendMail(mailOptions)

    // Updated caSent on Buyer
    await models.Buyer.update({
      caSent: true
    }, {
      where: {
        id: buyerId
      }
    })

    // Updated all logs Pending to Done
    await models.BuyerLog.update({
      followUpStatus: 'Done',
      modifiedBy_id: req.user.id
    }, {
      where: {
        buyer_id: buyerId
      }
    })

    // Insert in log
    await models.BuyerLog.create({
      followUpStatus: 'Pending',
      text: 'CA Sent',
      followUp: moment().add(1, 'days').format('YYYY-MM-DD hh:mm:ss'),
      business_id: businessId,
      buyer_id: buyerId,
      createdBy_id: req.user.id,
      modifiedBy_id: req.user.id
    })

    return res.status(201).json({
      data: {
        mail: responseMailer
      },
      message: `Email sent successfully to ${buyer.firstName} ${buyer.surname} <${
        buyer.email
      }>`
    })
  } catch (error) {
    return next(error)
  }
}

export const sendIM = async (req, res, next) => {
  const {
    buyerId,
    businessId
  } = req.body

  try {
    // // Verify exists buyer
    const buyer = await models.Buyer.findOne({
      where: {
        id: buyerId
      }
    })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    // // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: businessId
      },
      include: [{
        model: models.User,
        as: 'listingAgent'
      }]
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // // Verify notifyOwner on business
    // // if (!business.notifyOwner) {
    // //   throw new APIError({
    // //     message: 'Notify Owner is to false',
    // //     status: 400,
    // //     isPublic: true
    // //   })
    // // }

    // Verify business attach to buyer
    const enquiryBusinessBuyer = await models.EnquiryBusinessBuyer.findOne({
      where: {
        $and: {
          business_id: businessId,
          buyer_id: buyerId
        }
      }
    })

    if (!enquiryBusinessBuyer) {
      // Set on Enquiry table
      await models.EnquiryBusinessBuyer.create({
        buyer_id: buyer.id,
        business_id: business.id
      })
    }

    // Verify exists template
    const template = await models.EmailTemplate.findOne({
      where: {
        title: 'Send Business IM'
      }
    })
    if (!template) {
      throw new APIError({
        message: 'The email template not found',
        status: 404,
        isPublic: true
      })
    }

    const brokerDetails = await models.User.findOne({
      where: {
        id: business.brokerAccountName
      }
    })

    // Compile the template to use variables
    const templateCompiled = Handlebars.compile(template.body)
    const context = {
      buyer_name: `${buyer.firstName} ${buyer.surname}`,
      business_name: business.businessName,
      agents_name: `${brokerDetails.firstName} ${brokerDetails.lastName}`,
      agents_email: brokerDetails.email,
      agents_phone: brokerDetails.phoneMobile
        ? brokerDetails.phoneMobile : brokerDetails.phoneWork
    }

    // Set email options
    const mailOptions = {
      to: buyer.email,
      from: '"Xcllusive" <businessinfo@xcllusive.com.au>',
      subject: `${business.businessName} - ${template.subject}`,
      html: templateCompiled(context),
      attachments: template.enableAttachment ? [
        // {
        //   filename: `${template.title.trim()}.pdf`,
        //   path: template.attachmentPath
        // },
        {
          filename: `${business.businessName.trim()}_IM_${business.id}.pdf`,
          path: business.imUrl
        }
      ] : []
    }

    // Send Email
    const responseMailer = await mailer.sendMail(mailOptions)

    // Updated caSent on Buyer
    await models.Buyer.update({
      smSent: true
    }, {
      where: {
        id: buyerId
      }
    })

    // Updated all logs Pending to Done
    await models.BuyerLog.update({
      followUpStatus: 'Done',
      modifiedBy_id: req.user.id
    }, {
      where: {
        buyer_id: buyerId
      }
    })

    const userLogged = await models.User.findOne({
      // attributes: ['firstName', 'lastName'],
      where: {
        id: req.user.id
      }
    })

    // Insert in log
    await models.BuyerLog.create({
      text: `IM Sent to Buyer by ${userLogged.firstName} ${userLogged.lastName}`,
      followUpStatus: 'Pending',
      followUp: moment().add(1, 'days').format('YYYY-MM-DD hh:mm:ss'),
      business_id: businessId,
      buyer_id: buyerId,
      createdBy_id: req.user.id,
      modifiedBy_id: req.user.id
    })

    return res.status(201).json({
      data: {
        mail: responseMailer
      },
      message: `Email sent successfully to ${buyer.firstName} ${buyer.surname} <${
        buyer.email
      }>`
    })
  } catch (error) {
    return next(error)
  }
}

export const receivedCA = async (req, res, next) => {
  const {
    buyerId,
    businessId
  } = req.body
  const file = req.files.caFile

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({
      where: {
        id: buyerId
      }
    })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: businessId
      }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Verify file received
    if (!file) {
      throw new APIError({
        message: 'Expect one file upload named caFile',
        status: 400,
        isPublic: true
      })
    }

    // Verify file is pdf
    if (!/\/pdf$/.test(file.mimetype)) {
      throw new APIError({
        message: 'Expect pdf file',
        status: 400,
        isPublic: true
      })
    }

    // Upload file to aws s3
    const upload = await uploadToS3(
      'xcllusive-certificate-authority',
      file,
      `ca-buyer-${buyer.id}.pdf`
    )

    // updated CA received on buyer
    await models.Buyer.update({
      caReceived: true,
      attachmentUrl: upload.Location
    }, {
      where: {
        id: buyerId
      }
    })

    // Updated all logs Pending to Done
    await models.BuyerLog.update({
      followUpStatus: 'Done',
      modifiedBy_id: req.user.id
    }, {
      where: {
        buyer_id: buyerId
      }
    })

    // Insert in log
    await models.BuyerLog.create({
      text: 'CA Received',
      followUpStatus: 'Pending',
      followUp: moment().add(1, 'days').format('YYYY-MM-DD hh:mm:ss'),
      business_id: businessId,
      buyer_id: buyerId,
      createdBy_id: req.user.id,
      modifiedBy_id: req.user.id
    })

    return res.status(201).json({
      data: upload,
      message: `Email sent successfully to ${buyer.firstName} ${buyer.surname} <${
        buyer.email
      }>`
    })
  } catch (error) {
    return next(error)
  }
}

export const listLog = async (req, res, next) => {
  const {
    idBuyer: id
  } = req.params

  const limit = req.query.limit
  const offset = req.skip

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({
      where: {
        id
      }
    })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    const logs = await models.BuyerLog.findAndCountAll({
      where: {
        buyer_id: id
      },
      order: [
        ['dateTimeCreated', 'DESC']
      ],
      include: [{
        model: models.Business,
        attributes: ['businessName']
      }],
      limit,
      offset
    })

    return res.status(201).json({
      data: logs,
      pageCount: logs.count,
      itemCount: Math.ceil(logs.count / req.query.limit),
      message: logs.length === 0 ? 'Nothing buyer log found' : 'Get buyer log succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const listBusinessesFromBuyerLog = async (req, res, next) => {
  const {
    idBuyer
  } = req.params
  const {
    businessId
  } = req.query

  try {
    // Verify exists buyer
    const buyer = await models.Buyer.findOne({
      where: {
        id: idBuyer
      }
    })

    if (!buyer) {
      throw new APIError({
        message: 'Buyer not found',
        status: 404,
        isPublic: true
      })
    }

    const logs = await models.BuyerLog.findAndCountAll({
      where: {
        buyer_id: idBuyer,
        business_id: businessId
      },
      order: [
        ['dateTimeCreated', 'DESC']
      ],
      include: [{
        model: models.Business,
        attributes: ['businessName']
      }],
      limit: req.query.limit,
      offset: req.skip
    })

    const lastLog = await models.BuyerLog.findOne({
      where: {
        buyer_id: idBuyer,
        business_id: businessId,
        followUpStatus: 'Pending'
      },
      order: [
        ['dateTimeCreated', 'DESC']
      ],
      raw: true
    })

    return res.status(201).json({
      data: logs,
      lastLog,
      pageCount: logs.count,
      itemCount: Math.ceil(logs.count / req.query.limit),
      message: logs.length === 0
        ? 'No business found for buyer' : 'Get business from buyer succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const listBusinessesFromBuyer = async (req, res, next) => {
  const {
    idBuyer
  } = req.params

  try {
    // Verify exists buyer
    const buyers = await models.EnquiryBusinessBuyer.findAll({
      where: {
        buyer_id: idBuyer
      },
      group: ['business_id'],
      include: [{
        model: models.Business,
        attributes: ['businessName']
      }]
    })

    if (!buyers) {
      throw new APIError({
        message: 'Businesses not found',
        status: 404,
        isPublic: true
      })
    }

    return res.status(201).json({
      data: buyers,
      message: 'Get businesses from buyer succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const createLog = async (req, res, next) => {
  const newLog = {
    text: req.body.buyerLog_text ? req.body.buyerLog_text : '',
    followUp: req.body.buyerLog_followUp ? req.body.buyerLog_followUp : '',
    followUpStatus: 'Pending',
    business_id: req.body.business_id,
    buyer_id: req.body.buyer_id,
    modifiedBy_id: req.user.id,
    createdBy_id: req.user.id
  }

  try {
    await models.BuyerLog.update({
      followUpStatus: 'Done',
      modifiedBy_id: req.user.id
    }, {
      where: {
        buyer_id: req.body.buyer_id,
        business_id: req.body.business_id
      }
    })

    const log = await models.BuyerLog.create(newLog)

    return res.status(201).json({
      data: log,
      message: 'Buyer log created succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const updateLog = async (req, res, next) => {
  const {
    idLog
  } = req.params
  const updateLog = {
    text: req.body.buyerLog_text ? req.body.buyerLog_text : '',
    followUp: req.body.buyerLog_followUp ? req.body.buyerLog_followUp : '',
    followUpStatus: 'Pending',
    modifiedBy_id: req.user.id
  }

  try {
    // Verify exists log
    const log = await models.BuyerLog.findOne({
      where: {
        id: idLog
      }
    })

    if (!log) {
      throw new APIError({
        message: 'Buyer Log not found',
        status: 404,
        isPublic: true
      })
    }

    await models.BuyerLog.update(updateLog, {
      where: {
        id: idLog
      }
    })

    return res.status(201).json({
      data: log,
      message: 'Buyer log updated succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const finaliseLog = async (req, res, next) => {
  const {
    idBuyer
  } = req.params
  const {
    idBusiness
  } = req.body

  try {
    // Verify exists buyer and business
    const enquiry = await models.EnquiryBusinessBuyer.findAll({
      where: {
        buyer_id: idBuyer,
        business_id: idBusiness
      }
    })

    if (!enquiry) {
      throw new APIError({
        message: 'Cannot find enquiries.',
        status: 404,
        isPublic: true
      })
    }

    await models.BuyerLog.update({
      followUpStatus: 'Done',
      modifiedBy_id: req.user.id
    }, {
      where: {
        buyer_id: idBuyer,
        business_id: idBusiness
      }
    })

    return res.status(201).json({
      data: {},
      message: 'All logs have been finalised'
    })
  } catch (error) {
    return next(error)
  }
}

export const getBuyersFromBusiness = async (req, res, next) => {
  const {
    idBusiness
  } = req.params
  const {
    showAll
  } = req.query

  try {
    // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: idBusiness
      }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // count buyers from business enquiry
    const countAllBuyersFromBusiness = await models.EnquiryBusinessBuyer.count({
      where: {
        business_id: idBusiness
      },
      include: [{
        model: models.Buyer,
        as: 'Buyer',
        where: {
          $or: [{
            caReceived: {
              $eq: 1
            }
          }, {
            scanfilePath: {
              $ne: ''
            }
          }]
        }
      }],
      // group: [
      //   [
      //     { model: models.EnquiryBusinessBuyer, as: 'EnquiryBusinessBuyer' },
      //     'buyer_id'
      //   ]
      // ]
      group: ['buyer_id']
    })

    const whereBuyerLog = {
      buyer_id: {
        $col: 'EnquiryBusinessBuyer.buyer_id'
      },
      business_id: idBusiness,
      followUp: {
        $lte: moment(new Date()).format('YYYY-MM-DD 23:59:59')
      },
      followUpStatus: 'Pending'
    }

    const whereBuyer = {
      $or: [{
        caReceived: {
          $eq: 1
        }
      }, {
        scanfilePath: {
          $ne: ''
        }
      }]
    }

    if (showAll && JSON.parse(showAll)) {
      delete whereBuyerLog.followUpStatus
      delete whereBuyerLog.followUp
      // delete whereBuyer['$or']
    }

    // Get buyers from business enquiry
    const buyersFromBusiness = await models.Buyer.findAll({
      attributes: ['id', 'caReceived', 'scanfilePath', 'firstName', 'surname'],
      where: whereBuyer,
      include: [{
        attributes: ['buyer_id', 'business_id'],
        model: models.EnquiryBusinessBuyer,
        as: 'EnquiryBusinessBuyer',
        where: {
          business_id: idBusiness
        }
      }, {
        attributes: [
          'buyer_id', 'business_id', 'followUp', 'followUpStatus', 'text', 'dateTimeCreated'
        ],
        model: models.BuyerLog,
        as: 'BuyerLog',
        where: whereBuyerLog
      }],
      order: [
        [{
          model: models.BuyerLog,
          as: 'BuyerLog'
        }, 'followUp', 'DESC']
      ]

    })

    return res.status(201).json({
      data: {
        array: buyersFromBusiness,
        countAll: countAllBuyersFromBusiness.length
      },
      message: 'Success'
    })
  } catch (error) {
    return next(error)
  }
}

export const getBusinessFromBuyer = async (req, res, next) => {
  const {
    idBusiness
  } = req.params

  const _mapValuesToArray = array => {
    if (array.length > 0) {
      if (array[0].firstName) {
        return array.map((item, index) => ({
          key: index,
          text: `${item.firstName} ${item.lastName}`,
          value: item.id
        }))
      }
      return array.map((item, index) => ({
        key: index,
        text: item.label,
        value: item.id
      }))
    }
    return []
  }

  try {
    const business = await models.Business.findOne({
      where: {
        id: idBusiness
      },
      include: [{
        model: models.User,
        as: 'CreatedBy'
      }, {
        model: models.User,
        as: 'ModifiedBy'
      }, {
        model: models.User,
        as: 'listingAgent'
      }]
    })
    const stageList = await models.BusinessStage.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const sourceList = await models.BusinessSource.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const industryList = await models.BusinessIndustry.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const productList = await models.BusinessProduct.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const ratingList = await models.BusinessRating.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const typeList = await models.BusinessType.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const usersBroker = await models.User.findAll({
      raw: true,
      attributes: ['id', 'firstName', 'lastName'],
      where: {
        userType: 'Broker'
      }
    })
    const stageNotSignedList = await models.BusinessStageNotSigned.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const stageNotWantList = await models.BusinessStageNotWant.findAll({
      raw: true,
      attributes: ['id', 'label']
    })
    const lastScore = await models.Score.findOne({
      where: {
        business_id: idBusiness
      },
      order: [
        ['dateTimeCreated', 'DESC']
      ]
    })
    const countAllEnquiry = await models.EnquiryBusinessBuyer.findAndCountAll({
      where: {
        business_id: idBusiness
      }
    })

    const response = {
      business,
      lastScore,
      countAllEnquiry: countAllEnquiry.count,
      stageList: _mapValuesToArray(stageList),
      sourceList: _mapValuesToArray(sourceList),
      industryList: _mapValuesToArray(industryList),
      productList: _mapValuesToArray(productList),
      ratingList: _mapValuesToArray(ratingList),
      typeList: _mapValuesToArray(typeList),
      usersBroker: _mapValuesToArray(usersBroker),
      stageNotSignedList: _mapValuesToArray(stageNotSignedList),
      stageNotWantList: _mapValuesToArray(stageNotWantList)
    }
    return res.status(200).json(response)
  } catch (err) {
    return next(err)
  }
}

export const updateBusinessFromBuyers = async (req, res, next) => {
  const {
    idBusiness
  } = req.params

  const {
    stage,
    businessSource,
    businessRating,
    businessIndustry,
    businessProduct,
    businessType,
    // typeId,
    brokerAccountName,
    depositeTakenDate,
    settlementDate
  } = req.body

  req.body.stageId = stage === '' ? undefined : stage
  req.body.sourceId = businessSource === '' ? undefined : businessSource
  req.body.ratingId = businessRating === '' ? undefined : businessRating
  req.body.industryId = businessIndustry === '' ? undefined : businessIndustry
  req.body.productId = businessProduct === '' ? undefined : businessProduct
  req.body.typeId = businessType === '' ? undefined : businessType
  // req.body.typeId = typeId === '' ? undefined : typeId
  req.body.depositeTakenDate =
    depositeTakenDate instanceof Date ? depositeTakenDate : undefined
  req.body.settlementDate = settlementDate instanceof Date ? settlementDate : undefined
  req.body.brokerAccountName = brokerAccountName === '' ? undefined : brokerAccountName
  req.body.modifiedBy_id = req.user.id

  try {
    const business = await models.Business.findOne({
      where: {
        id: idBusiness
      }
    })

    if (!business.daysOnTheMarket && stage === 4) {
      req.body.daysOnTheMarket = moment()
    }

    if (business.stageId !== 4 && req.body.stageId === 4) {
      req.body.dateChangedToForSale = moment()
    }

    await models.Business.update(req.body, {
      where: {
        id: idBusiness
      }
    })

    return res
      .status(200)
      .json({
        message: `Business BS${idBusiness} updated with success`
      })
  } catch (error) {
    return next(error)
  }
}

export const getGroupEmail = async (req, res, next) => {
  const {
    idBusiness
  } = req.params

  // const response = []

  try {
    // Verify exists business
    const business = await models.Business.findOne({
      where: {
        id: idBusiness
      }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    // Get buyers from business enquiry
    const buyersFromBusiness = await models.EnquiryBusinessBuyer.findAll({
      where: {
        business_id: idBusiness
      },
      include: [{
        model: models.Buyer,
        where: {
          caReceived: 1
        },
        as: 'Buyer'
      }]
    })

    const arrayGroupEmail = await Promise.all(
      buyersFromBusiness.map(async item => {
        const logs = await models.BuyerLog.findAll({
          where: {
            buyer_id: item.buyer_id,
            business_id: item.business_id
          }
        })

        const isPending = await Promise.all(
          logs.map(log => {
            return log.followUpStatus
          })
        )

        if (item.Buyer.caReceived || item.Buyer.scanfilePath !== '') {
          return {
            id: item.Buyer.id,
            email: item.Buyer.email,
            firstName: item.Buyer.firstName,
            lastName: item.Buyer.surname,
            isPending: isPending.some(item => {
              return item === 'Pending'
            })
          }
        }
      })
    )

    const filterArrayGroupEmail = arrayGroupEmail.filter(item => {
      return item !== undefined
    })

    return res.status(201).json({
      data: filterArrayGroupEmail,
      message: 'Success'
    })
  } catch (error) {
    return next(error)
  }
}

export const sendGroupEmail = async (req, res, next) => {
  const {
    to,
    subject,
    body
  } = req.body
  const fileAttachment = req.files.attachment
  const sentTo = []
  try {
    const emailToOffice = await models.SystemSettings.findOne({
      where: 1
    })
    for (let buyer of JSON.parse(to)) {
      const mailOptions = {
        to: buyer.email,
        from: '"Xcllusive Business Sales" <businessinfo@xcllusive.com.au>',
        subject,
        replyTo: buyer.replyTo
          ? req.user.email : `${req.user.email}, ${emailToOffice.emailOffice}`,
        cc: req.user.email,
        html: `
        <p>Dear ${buyer.firstName} ${buyer.lastName}</p>
        
        </br>
        <p>${body}</p>
        </br>

        <p>Xcllusive Business Sales</p>
        <p>www.xcllusive.com.au | (02) 9817 3331</p>
        `,
        attachments: fileAttachment ? [{
          filename: fileAttachment.name,
          content: fileAttachment.data
        }] : []
      }
      const resMailer = await mailer.sendMail(mailOptions)
      if (resMailer) sentTo.push(resMailer.envelope.to[0])
    }

    return res.status(201).json({
      data: sentTo,
      message: 'Group emails sent successfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const createWeeklyReport = async (req, res, next) => {
  const newWeeklyReport = req.body
  newWeeklyReport.createdBy_id = req.user.id

  var startDate = moment()
  startDate = startDate.subtract(7, 'd')
  const sevenDaysAgo = startDate.format('YYYY-MM-DD HH:MM:SS')

  try {
    // // get last text to do
    // const lastTextToDo = await models.BrokerWeeklyReport.findOne({
    //   where: { business_id: newWeeklyReport.business_id },
    //   order: [['dateTimeCreatedToDo', 'DESC']]
    // })
    // if (lastTextToDo) {
    //   newWeeklyReport.textToDo = lastTextToDo.textToDo
    // }

    const business = await models.Business.findOne({
      where: {
        id: newWeeklyReport.business_id
      }
    })
    if (moment(business.daysOnTheMarket).isValid()) {
      newWeeklyReport.daysOnTheMarket = moment().diff(business.daysOnTheMarket, 'day')
    }
    if (moment(business.dateChangedToSalesMemorandum).isValid()) {
      newWeeklyReport.daysSinceEngaged = moment().diff(
        business.dateChangedToSalesMemorandum,
        'day'
      )
    }
    newWeeklyReport.data120DayGuarantee =
      business.data120DayGuarantee === '0' ? 'No' : 'Yes'

    const nOfEnquiries = await models.EnquiryBusinessBuyer.findAndCountAll({
      where: {
        business_id: newWeeklyReport.business_id
      }
    })
    newWeeklyReport.nOfEnquiries = nOfEnquiries.count

    const nOfEnquiries7Days = await models.EnquiryBusinessBuyer.findAndCountAll({
      where: {
        business_id: newWeeklyReport.business_id,
        dateTimeCreated: {
          $gte: sevenDaysAgo
        }
      }
    })
    newWeeklyReport.nOfEnquiries7Days = nOfEnquiries7Days.count

    const nOfPendingTasks = await models.BuyerLog.count({
      where: {
        business_id: newWeeklyReport.business_id,
        followUpStatus: 'Pending'
      },
      include: [{
        model: models.Buyer,
        as: 'Buyer',

        where: {
          id: {
            $col: 'BuyerLog.buyer_id'
          },
          caReceived: 1
        }
      }],
      group: ['buyer_id']
    })
    newWeeklyReport.nOfPendingTasks = nOfPendingTasks.length

    const nOfNewLogs7Days = await models.BuyerLog.findAndCountAll({
      where: {
        business_id: newWeeklyReport.business_id,
        dateTimeCreated: {
          $gte: sevenDaysAgo
        }
      }
    })
    newWeeklyReport.nOfNewLogs7Days = nOfNewLogs7Days.count

    console.log(newWeeklyReport)

    const buyer = await models.BrokerWeeklyReport.create(newWeeklyReport)
    return res.status(201).json({
      data: buyer,
      message: 'Weekly Report created with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const getLastWeeklyReport = async (req, res, next) => {
  const lastWK = req.query

  try {
    const lastWeeklyReport = await models.BrokerWeeklyReport.findOne({
      where: {
        business_id: lastWK.businessId
      },
      order: [
        ['dateTimeCreated', 'DESC']
      ],
      raw: true
    })
    return res.status(201).json({
      data: lastWeeklyReport,
      message: 'Get last Weekly Report with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const updateWeeklyReport = async (req, res, next) => {
  const weeklyReport = req.body
  weeklyReport.dateTimeCreated = moment()

  try {
    // Verify exists report
    const report = await models.BrokerWeeklyReport.findOne({
      where: {
        id: weeklyReport.id
      }
    })

    if (!report) {
      throw new APIError({
        message: 'Report not found',
        status: 404,
        isPublic: true
      })
    }
    if (weeklyReport.textToDo) {
      const updateToDo = {
        textToDo: weeklyReport.textToDo,
        dateTimeCreatedToDo: weeklyReport.dateTimeCreatedToDo
      }
      await models.BrokerWeeklyReport.update(updateToDo, {
        where: {
          id: weeklyReport.id
        }
      })
    } else {
      await models.BrokerWeeklyReport.update(weeklyReport, {
        where: {
          id: weeklyReport.id
        }
      })
    }
    return res.status(201).json({
      data: weeklyReport,
      message: 'Weekly Report updated with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const getBrokersPerRegion = async (req, res, next) => {
  const region = req.query.region

  const _mapValuesToArray = array => {
    if (array.length > 0) {
      if (array[0].firstName) {
        return array.map((item, index) => ({
          key: index,
          text: `${item.firstName} ${item.lastName}`,
          value: item.id
        }))
      }
      return array.map((item, index) => ({
        key: index,
        text: item.label,
        value: item.id
      }))
    }
    return []
  }

  try {
    // Verify exists buyer
    const brokers = await models.User.findAll({
      where: {
        officeId: region,
        userType: 'Broker'
      },
      order: [
        ['firstName', 'ASC']
      ]
    })

    if (!brokers) {
      throw new APIError({
        message: 'Brokers not found',
        status: 404,
        isPublic: true
      })
    }

    return res.status(201).json({
      data: _mapValuesToArray(brokers),
      message: 'Get brokers per region succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const getBusinessesPerBroker = async (req, res, next) => {
  const broker = req.query.brokerId

  var startDate = moment()
  startDate = startDate.subtract(7, 'd')
  const sevenDaysAgo = startDate.format('YYYY-MM-DD HH:MM:SS')

  try {
    const businesses = await models.Business.findAll({
      where: {
        brokerAccountName: broker,
        stageId: [3, 4, 5] // Sales Memo, For Sale, Under Offer
      },
      order: [
        ['businessName', 'ASC']
      ]
    })

    const response = await Promise.all(
      businesses.map(async business => {
        const reports = await models.BrokerWeeklyReport.findOne({
          where: {
            business_id: business.id
          },
          order: [
            ['dateTimeCreated', 'DESC']
          ]
        })

        const nOfEnquiries = await models.EnquiryBusinessBuyer.findAndCountAll({
          where: {
            business_id: business.id
          }
        })

        const nOfEnquiries7Days = await models.EnquiryBusinessBuyer.findAndCountAll({
          where: {
            business_id: business.id,
            dateTimeCreated: {
              $gte: sevenDaysAgo
            }
          }
        })

        const nOfPendingTasks = await models.BuyerLog.count({
          where: {
            business_id: business.id,
            followUpStatus: 'Pending'
          },
          include: [{
            model: models.Buyer,
            as: 'Buyer',

            where: {
              id: {
                $col: 'BuyerLog.buyer_id'
              },
              caReceived: 1
            }
          }],
          group: ['buyer_id']
        })

        const nOfNewLogs7Days = await models.BuyerLog.findAndCountAll({
          where: {
            business_id: business.id,
            dateTimeCreated: {
              $gte: sevenDaysAgo
            }
          }
        })

        const oneBeforeLastTextToDo = await models.BrokerWeeklyReport.findAll({
          where: {
            business_id: business.id
          },
          order: [
            ['dateTimeCreated', 'DESC']
          ]
        })

        return {
          businesses,
          business,
          reports,
          nOfEnquiries,
          nOfEnquiries7Days,
          nOfPendingTasks: nOfPendingTasks.length,
          nOfNewLogs7Days,
          arrayOneBeforeLastTextToDo: oneBeforeLastTextToDo[1]
            ? oneBeforeLastTextToDo[1] : null
        }
      })
    )
    return res.status(200).json(response)
  } catch (error) {
    return next(error)
  }
}

export const getBusinessHistoricalWeekly = async (req, res, next) => {
  const businessId = req.query.businessId

  try {
    const historicalWeekly = await models.BrokerWeeklyReport.findAll({
      where: {
        business_id: businessId
      },
      order: [
        ['dateTimeCreated', 'DESC']
      ],
      raw: true
    })

    const expectedObject = await models.BrokerWeeklyReport.findOne({
      where: {
        business_id: businessId,
        expectedPrice: {
          $gt: 0
        }
      },
      order: [
        ['dateTimeCreated', 'DESC']
      ],
      raw: true
    })

    return res.status(201).json({
      data: historicalWeekly,
      expectedObject,
      message: 'Get historical weekly report with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const verifyDuplicatedBuyer = async (req, res, next) => {
  const {
    telephone1,
    email
  } = req.query

  const telephoneRaw = telephone1.split(' ').join('').split('-').join('')

  let whereOptions = {}
  if (email !== '' && email !== ' ') {
    whereOptions.$or = [{
      email: {
        $like: `%${email}%`
      }
    }]
  }
  if (telephone1 !== '' && telephone1 !== ' ') {
    if (email !== '' && email !== ' ') {
      whereOptions.$or.push([{
        telephone1Number: {
          $like: `%${telephoneRaw}%`
        }
      }])
    } else {
      whereOptions.$or = [{
        telephone1Number: {
          $like: `%${telephoneRaw}%`
        }
      }]
    }
  }

  try {
    let duplicatedBuyers = null
    if ((telephone1 !== '' && telephone1 !== ' ') || (email !== '' && email !== ' ')) {
      duplicatedBuyers = await models.Buyer.findOne({
        raw: true,
        attributes: ['firstName', 'surname', 'email', 'telephone1'],
        where: whereOptions
      })
    }

    return res.status(201).json({
      data: duplicatedBuyers,
      message: ''
    })
  } catch (error) {
    return next(error)
  }
}

export const updateBusinessFromBuyer = async (req, res, next) => {
  const {
    idBusiness
  } = req.params

  const {
    stage,
    businessSource,
    businessRating,
    businessIndustry,
    businessProduct,
    businessType,
    // typeId,
    brokerAccountName,
    depositeTakenDate,
    settlementDate
  } = req.body

  req.body.stageId = stage === '' ? undefined : stage
  req.body.sourceId = businessSource === '' ? undefined : businessSource
  req.body.ratingId = businessRating === '' ? undefined : businessRating
  req.body.industryId = businessIndustry === '' ? undefined : businessIndustry
  req.body.productId = businessProduct === '' ? undefined : businessProduct
  req.body.typeId = businessType === '' ? undefined : businessType
  // req.body.typeId = typeId === '' ? undefined : typeId
  req.body.depositeTakenDate =
    depositeTakenDate instanceof Date ? depositeTakenDate : undefined
  req.body.settlementDate = settlementDate instanceof Date ? settlementDate : undefined
  req.body.brokerAccountName = brokerAccountName === '' ? undefined : brokerAccountName
  req.body.modifiedBy_id = req.user.id

  try {
    const business = await models.Business.findOne({
      where: {
        id: idBusiness
      }
    })

    if (!business.daysOnTheMarket && stage === 4) {
      req.body.daysOnTheMarket = moment()
    }

    if (business.stageId !== 4 && req.body.stageId === 4) {
      req.body.dateChangedToForSale = moment()
    }

    await models.Business.update(req.body, {
      where: {
        id: idBusiness
      }
    })

    return res
      .status(200)
      .json({
        message: `Business BS${idBusiness} updated with success`
      })
  } catch (error) {
    return next(error)
  }
}

export const getBusinessLogFromBuyer = async (req, res, next) => {
  const {
    businessId,
    search
  } = req.query
  const whereOptions = {
    business_id: businessId
  }

  try {
    // Verify exists buyer
    const business = await models.Business.findOne({
      where: {
        id: businessId
      }
    })

    if (!business) {
      throw new APIError({
        message: 'Business not found',
        status: 404,
        isPublic: true
      })
    }

    if (search) {
      whereOptions.$or = [{
        text: {
          $like: `%${search}%`
        }
      }, {
        followUpStatus: {
          $like: `%${search}%`
        }
      }]
    }

    const logs = await models.BusinessLog.findAll({
      where: whereOptions,
      order: [
        ['followUp', 'DESC']
      ],
      include: [{
        model: models.Business,
        attributes: ['businessName']
      }, {
        model: models.User,
        as: 'CreatedBy'
      }, {
        model: models.User,
        as: 'ModifiedBy'
      }]
    })

    return res.status(201).json({
      data: logs,
      message: logs.length === 0
        ? 'Nothing business log found' : 'Get business log with succesfully'
    })
  } catch (error) {
    return next(error)
  }
}

export const updateBusinessLogFromBuyer = async (req, res, next) => {
  const {
    idBusiness
  } = req.params
  const newLog = req.body

  try {
    await models.BusinessLog.update({
      followUpStatus: 'Done'
    }, {
      where: {
        business_id: idBusiness
      }
    })

    await models.BusinessLog.create({
      text: newLog.businessLog_text,
      createdBy_id: req.user.id,
      followUpStatus: 'Pending',
      followUp: moment(newLog.businessLog_followUp).format('YYYY-MM-DD hh:mm:ss'),
      business_id: idBusiness
    })
    return res.status(200).json({
      message: 'Business log Saved'
    })
  } catch (error) {
    return next(error)
  }
}

export const finaliseBusinessLogFromBuyer = async (req, res, next) => {
  console.log('olaaa')
  const {
    idBusiness
  } = req.params

  try {
    await models.BusinessLog.update({
      followUpStatus: 'Done'
    }, {
      where: {
        business_id: idBusiness
      }
    })

    return res.status(200).json({
      message: 'Business log finalised'
    })
  } catch (error) {
    return next(error)
  }
}
