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
    idBuyer: Joi.number()
      .min(1)
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
    idBuyer: Joi.number()
      .min(1)
      .required()
  }
}

export const removeBuyer = {
  params: {
    idBuyer: Joi.number()
      .min(1)
      .required()
  }
}

export const sendCA = {
  body: {
    buyerId: Joi.number()
      .min(1)
      .required(),
    businessId: Joi.number()
      .min(1)
      .required()
  }
}

export const sendIM = {
  body: {
    buyerId: Joi.number()
      .min(1)
      .required(),
    businessId: Joi.number()
      .min(1)
      .required()
  }
}

export const receivedCA = {
  body: {
    buyerId: Joi.number()
      .min(1)
      .required(),
    businessId: Joi.number()
      .min(1)
      .required()
  }
}

export const listLog = {
  params: {
    idBuyer: Joi.number()
      .min(1)
      .required()
  }
}

export const listBusinessesFromBuyerLog = {
  params: {
    idBuyer: Joi.number()
      .min(1)
      .required()
  },
  query: {
    businessId: Joi.number()
      .min(1)
      .required()
  }
}

export const listBusinessesFromBuyer = {
  params: {
    idBuyer: Joi.number()
      .min(1)
      .required()
  }
}

export const finaliseLog = {
  params: {
    idBuyer: Joi.number()
      .min(1)
      .required()
  },
  body: {
    idBusiness: Joi.number()
      .min(1)
      .required()
  }
}
