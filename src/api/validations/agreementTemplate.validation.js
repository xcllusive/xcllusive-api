import Joi from 'joi'

export default {
  get: {
    params: {
      idAgreementTemplate: Joi.number()
        .min(1)
        .required()
    }
  },
  preview: {
    params: {
      idAgreementTemplate: Joi.number()
        .min(1)
        .required()
    }
    // body: {
    //   values: Joi.object().required()
    // }
  },
  list: {
    query: {
      perPage: Joi.number(),
      state: Joi.string().max(128)
    }
  },
  create: {
    body: {
      title: Joi.string().required(),
      state: Joi.string().required(),
      header: Joi.string(),
      body: Joi.string(),
      footer: Joi.string(),
      handlebars: Joi.string()
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
      email: Joi.string().email().required(),
      refreshToken: Joi.string().required()
    }
  }
}
