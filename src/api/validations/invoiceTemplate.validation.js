import Joi from 'joi'

export default {
  get: {
    params: {
      idInvoiceTemplate: Joi.number()
        .min(1)
        .required()
    }
  },
  list: {
    query: {
      limit: Joi.number(),
      state: Joi.string().max(128)
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
      idInvoiceTemplate: Joi.number()
        .min(1)
        .required()
    }
  }
}
