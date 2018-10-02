import Joi from 'joi'

export const list = {
  query: {
    type: Joi.string().min(1),
    quantity: Joi.number().min(1),
    priceRange: Joi.number().min(1),
    trend: Joi.string().min(1)
  }
}
