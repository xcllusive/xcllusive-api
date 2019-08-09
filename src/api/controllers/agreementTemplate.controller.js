import handlebars from 'handlebars'
import APIError from '../utils/APIError'
import models from '../../config/sequelize'

export const get = async (req, res, next) => {
  const { idAgreementTemplate: id } = req.params

  try {
    const template = await models.AgreementTemplate.findOne({ where: { id } })

    if (JSON.parse(template.handlebars)) {
      template.handlebars = JSON.parse(template.handlebars)
    }

    return res.status(201).json({
      data: template,
      message: 'Template get with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const preview = async (req, res, next) => {
  const { idAgreementTemplate: id } = req.params
  const { values } = req.body

  try {
    const template = await models.AgreementTemplate.findOne({ where: { id } })

    const body = `
    ${template.header}
    </br>
    ${template.body}
    </br>
    ${template.footer}
    `

    const bodyHandlebars = handlebars.compile(body)

    const context = {
      owner_first_name: values ? values.firstNameV : '',
      owner_last_name: values ? values.lastNameV : '',
      owner_phone: values ? values.vendorPhone1 : '',
      business_abn: values ? values.businessABN : '',
      business_address: values ? values.address : '',
      business_known_as: values ? values.businessKnownAs : '',
      conducted_at: values ? values.conductedAt : '',
      listed_price: values ? values.listedPrice : '',
      appraisal_high: values ? values.appraisalHigh : '',
      appraisal_low: values ? values.appraisalLow : '',
      engagement_fee: values ? values.engagementFee : '',
      commission_perc: values ? values.commissionPerc : '',
      commission_discount: values ? values.commissionDiscount : '',
      introduction_parties: values ? values.introductionParties : '',
      commission_property: values ? values.commissionProperty : '',
      address_property: values ? values.addressProperty : '',
      price_property: values ? values.priceProperty : ''
    }

    const bodyCompiled = bodyHandlebars(context)

    return res.status(201).json({
      data: bodyCompiled,
      message: 'Preview generated with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const list = async (req, res, next) => {
  const { perPage, state, typeAgreement } = req.query

  const options = {
    attributes: ['id', 'title', 'state'],
    limit: perPage || 50
  }

  if (state) {
    options.where = {
      state,
      type: typeAgreement === 'businessAgreement' ? 0 : 1
    }
  }

  try {
    const templates = await models.AgreementTemplate.findAll(options)
    return res.status(201).json({
      data: templates,
      message: 'Templates list with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const newAgreementTemplate = req.body

  newAgreementTemplate.createdBy_id = req.user.id
  newAgreementTemplate.modifiedBy_id = req.user.id

  try {
    // Create email template
    const template = await models.AgreementTemplate.create(newAgreementTemplate)

    return res.status(201).json({
      data: template,
      message: 'Template agreement created with success'
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const { idAgreementTemplate: id } = req.params
  const editAgreementTemplate = req.body

  editAgreementTemplate.modifiedBy_id = req.user.id

  /* update description type */
  editAgreementTemplate.typeDescription = editAgreementTemplate.type === 0 ? 'Business' : 'Property'

  try {
    const template = await models.AgreementTemplate.findOne({ where: { id } })

    if (!template) {
      throw new APIError({
        message: 'Template not found',
        status: 400,
        isPublic: true
      })
    }

    const updatedTemplate = await models.AgreementTemplate.update(editAgreementTemplate, {
      where: { id }
    })

    return res.status(201).json({
      data: updatedTemplate,
      message: 'Template updated with success'
    })
  } catch (error) {
    return next(error)
  }
}
