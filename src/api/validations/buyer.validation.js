import Joi from 'joi'

export const listBuyers = {
  query: {
    page: Joi.number().min(1),
    perPage: Joi.number()
      .min(1)
      .max(100),
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email()
  }
}

export const createBuyer = {
  body: {
    email: Joi.string()
      .email()
      .required(),
    firstName: Joi.string()
      .max(128)
      .required(),
    surname: Joi.string()
      .max(128)
      .required()
  }
}

export const getBuyer = {
  params: {
    idBuyer: Joi.string()
      .regex(/^[0-9]$/)
      .required()
  }
}

export const updateBuyer = {
  body: {
    email: Joi.string().email(),
    password: Joi.string()
      .min(6)
      .max(128),
    name: Joi.string().max(128)
  },
  params: {
    userId: Joi.string()
      .regex(/^[a-fA-F0-9]{24}$/)
      .required()
  }
}

export const removeBuyer = {
  params: {
    idBuyer: Joi.string()
      .regex(/^[0-9]{24}$/)
      .required()
  }
}
