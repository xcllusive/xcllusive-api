import Joi from 'joi'

export default {
  get: {
    params: {
      idInvoice: Joi.number()
        .min(1)
        .required()
    }
  },
  create: {
    body: {
      body: Joi.string().required(),
      businessId: Joi.number().required()
    }
  },
  update: {
    body: {
      title: Joi.string(),
      state: Joi.string(),
      header: Joi.string(),
      body: Joi.string(),
      footer: Joi.string(),
      handlebars: Joi.string()
    }
  }
}
