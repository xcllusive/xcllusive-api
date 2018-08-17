import Joi from 'joi'

export default {
  get: {
    params: {
      idInvoice: Joi.number()
        .min(1)
        .required()
    }
  },
  getLast: {
    query: {
      businessId: Joi.number().min(1)
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
  },
  makePdf: {
    params: {
      idInvoice: Joi.number()
        .min(1)
        .required()
    }
  }
}
