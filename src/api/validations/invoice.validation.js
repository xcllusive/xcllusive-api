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
  },
  sendEmail: {
    body: {
      mail: Joi.object().required(),
      invoiceId: Joi.string()
        .min(1)
        .required(),
      businessId: Joi.string()
        .min(1)
        .required()
      // mail: Joi.object().keys({
      //   to: Joi.string()
      //     .required('To is required.')
      //     .email('Invalid email address.'),
      //   subject: Joi.string().required('Subject is required.'),
      //   body: Joi.string().required('Body is required.')
      // })
    }
  }
}
