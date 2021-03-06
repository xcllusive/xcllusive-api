import Joi from 'joi'

export default {
  get: {
    params: {
      businessId: Joi.number()
        .min(1)
        .required()
    }
  },
  generate: {
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
  },
  sendEmail: {
    body: {
      body: Joi.string().required(),
      businessId: Joi.number().required()
      // mail: Joi.object().keys({
      //   to: Joi.string()
      //     .required('To is required.')
      //     .email('Invalid email address.'),
      //   subject: Joi.string().required('Subject is required.'),
      //   body: Joi.string().required('Body is required.')
      // })
    }
  },
  getEmailTemplate: {
    params: {
      idEmailTemplate: Joi.number()
        .min(1)
        .required()
    },
    query: {
      businessId: Joi.number().min(1).required()
    }
  }
}
