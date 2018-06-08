import Joi from 'joi'

export const list = {
  query: {
    scoreRegister: Joi.string().min(1)
  }
}

export const get = {
  params: {
    scoreRegisterId: Joi.number()
      .min(1)
      .required()
  }
}

export const create = {
  body: {
    label: Joi.string()
      .min(1)
      .required(),
    type: Joi.string()
      .max(128)
      .required()
  }
}

export const update = {
  body: {
    label: Joi.string()
      .min(1)
      .required()
  },
  params: {
    scoreRegisterId: Joi.number()
      .min(1)
      .required()
  }
}

export const remove = {
  params: {
    scoreRegisterId: Joi.number()
      .min(1)
      .required()
  }
}
