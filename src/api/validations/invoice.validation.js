import Joi from 'joi'

export default {
  get: {
    params: {
      idInvoice: Joi.number()
        .min(1)
        .required()
    }
  },
  list: {
    query: {
      businessId: Joi.number()
        .min(1)
        .required(),
      limit: Joi.number().min(1)
    }
  },
  create: {
    body: {

    }
  },
  update: {
    body: {

    }
  },
  remove: {
    params: {
      idInvoice: Joi.number()
        .min(1)
        .required()
    }
  }
}
