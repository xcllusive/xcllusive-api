import Joi from 'joi'

export const update = {
  body: {
    emailOffice: Joi.string().email()
  }
}
