import Joi from 'joi'

export const getGroupEmail = {
  params: {
    idBusiness: Joi.number()
      .min(1)
      .required()
  }
}

export const uploadedIM = {
  body: {
    businessId: Joi.number()
      .min(1)
      .required()
  }
}
