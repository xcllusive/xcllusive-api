import models from '../../config/sequelize'

export const getBusiness = async (req, res, next) => {
  const {
    idBusiness
  } = req.params

  const _mapValuesToArray = (array) => {
    if (array.length > 0) {
      if (array[0].firstName) {
        return array.map((item, index) => ({ key: index, text: `${item.firstName} ${item.lastName}`, value: `${item.firstName} ${item.lastName}` })) 
      }
      return array.map((item, index) => ({ key: index, text: item.label, value: item.id }))
    }
    return []
  }

  try {
    const business = await models.Business.findOne({ where: { id: idBusiness } })
    const stageList = await models.BusinessStage.findAll({ raw: true, attributes: ['id', 'label'] })
    const sourceList = await models.BusinessSource.findAll({ raw: true, attributes: ['id', 'label'] })
    const industryList = await models.BusinessIndustry.findAll({ raw: true, attributes: ['id', 'label'] })
    const ownersTimeList = await models.BusinessOwnersTime.findAll({ raw: true, attributes: ['id', 'label'] })
    const productList = await models.BusinessProduct.findAll({ raw: true, attributes: ['id', 'label'] })
    const ratingList = await models.BusinessRating.findAll({ raw: true, attributes: ['id', 'label'] })
    const typeList = await models.BusinessType.findAll({ raw: true, attributes: ['id', 'label'] })
    const usersStaff = await models.User.findAll({ raw: true, attributes: ['id', 'firstName', 'lastName'], where: { userType: 'Staff' } })
    const stageNotSignedList = await models.BusinessStageNotSigned.findAll({ raw: true, attributes: ['id', 'label'] })
    const stageNotWantList = await models.BusinessStageNotWant.findAll({ raw: true, attributes: ['id', 'label'] })

    const response = {
      business,
      stageList: _mapValuesToArray(stageList),
      sourceList: _mapValuesToArray(sourceList),
      industryList: _mapValuesToArray(industryList),
      ownersTimeList: _mapValuesToArray(ownersTimeList),
      productList: _mapValuesToArray(productList),
      ratingList: _mapValuesToArray(ratingList),
      typeList: _mapValuesToArray(typeList),
      usersStaff: _mapValuesToArray(usersStaff),
      stageNotSignedList: _mapValuesToArray(stageNotSignedList),
      stageNotWantList: _mapValuesToArray(stageNotWantList)
    }
    return res.status(200).json(response)
  } catch (err) {
    console.log(err)
    return next(err)
  }
}

export const list = async (req, res, next) => {
  let search = req.query.search
  let whereOptions = {}

  if (search && search.length > 0) {
    if (search.includes('BS') || search.includes('bs')) {
      if (search.includes('BS')) search = search.replace(/BS/g, '')
      if (search.includes('bs')) search = search.replace(/bs/g, '')
      whereOptions = {
        where: {
          id: {
            $eq: search
          }
        }
      }
    } else {
      whereOptions = {
        where: {
          $or: [
            {
              businessName: {
                $like: `%${search}%`
              }
            },
            {
              firstNameV: {
                $like: `%${search}%`
              }
            },
            {
              lastNameV: {
                $like: `%${search}%`
              }
            }
          ]
        }
      }
    }
  }

  const options = {
    attributes: ['id', 'businessName', 'firstNameV', 'lastNameV']
  }
  try {
    const businesses = await models.Business.findAll(Object.assign(options, whereOptions))
    return res.status(200).json(businesses)
  } catch (err) {
    return next(err)
  }
}

export const create = async (req, res, next) => {
  const newBusiness = {
    businessName: req.body.businessName,
    firstNameV: req.body.firstName,
    lastNameV: req.body.lastName,
    vendorPhone1: req.body.vendorPhone1,
    vendorPhone2: req.body.vendorPhone2,
    vendorPhone3: req.body.vendorPhone3,
    vendorEmail: req.body.vendorEmail,
    sourceId: req.body.businessSource === '' ? null : req.body.businessSource,
    sourceNotes: req.body.sourceNotes,
    description: req.body.description,
    stage: 'Potential Listing'
  }

  try {
    const user = await models.User.findOne({ where: { id: req.user.id }, attributes: ['firstName', 'lastName'] })
    newBusiness.listingAgent = `${user.firstName} ${user.lastName}`
    await models.Business.create(newBusiness)
    return res.status(200).json({ message: 'Business created with success' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const {
    idBusiness
  } = req.params

  if (!idBusiness || idBusiness === 'undefined') throw new Error(`Business id does not exist`)

  const {
    businessName,
    firstNameV,
    lastNameV,
    vendorPhone1,
    vendorPhone2,
    vendorPhone3,
    vendorEmail,
    sourceNotes,
    description,
    businessNameSecondary,
    businessABN,
    businessURL,
    address1,
    suburb,
    state,
    postCode,
    data120DayGuarantee,
    notifyOwner,
    businessStage,
    businessSource,
    businessRating,
    businessIndustry,
    businessOwnersTime,
    businessProduct,
    businessType,
    listingAgent,
    staffAccountName,
    listedPrice,
    currentPrice,
    engagementFee,
    commissionPerc,
    minimumCharge,
    appraisalHigh,
    appraisalLow,
    depositeTaken,
    depositeTakenDate,
    commissionSold,
    settlementDate,
    soldPrice,
    attachedPurchaser,
    searchNote,
    afterSalesNotes
  } = req.body

  const business = {
    businessName,
    firstNameV,
    lastNameV,
    vendorPhone1,
    vendorPhone2,
    vendorPhone3,
    vendorEmail,
    sourceNotes,
    description,
    businessNameSecondary,
    businessABN,
    businessURL,
    address1,
    suburb,
    state,
    postCode,
    data120DayGuarantee,
    notifyOwner,
    listingAgent,
    stageId: businessStage === '' ? null : businessStage,
    sourceId: businessSource === '' ? null : businessSource,
    ratingId: businessRating === '' ? null : businessRating,
    industryId: businessIndustry === '' ? null : businessIndustry,
    ownersTimeId: businessOwnersTime === '' ? null : businessOwnersTime,
    productId: businessProduct === '' ? null : businessProduct,
    typeId: businessType === '' ? null : businessType,
    staffAccountName,
    listedPrice,
    currentPrice,
    engagementFee,
    commissionPerc,
    minimumCharge,
    appraisalHigh,
    appraisalLow,
    depositeTaken,
    depositeTakenDate,
    commissionSold,
    settlementDate,
    soldPrice,
    attachedPurchaser,
    searchNote,
    afterSalesNotes
  }

  try {
    await models.Business.update(business, { where: { id: idBusiness } })
    return res.status(200).json({ message: `Business BS${idBusiness} updated with success` })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const { id } = req.body
  try {
    await models.User.destroy({ where: { id } })
    return res.status(200).json({ message: 'User removed with success' })
  } catch (error) {
    return next(error)
  }
}

export const updateListingAgent = async (req, res, next) => {
  const {
    listingAgentName
  } = req.body

  const {
    idBusiness
  } = req.params

  const data = {
    listingAgent: listingAgentName
  }

  if (!idBusiness || idBusiness === 'undefined') throw new Error(`Business id does not exist`)

  try {
    await models.Business.update(data, { where: { id: idBusiness } })
    return res.status(200).json({ message: `Agent list on business BS${idBusiness} updated with success` })
  } catch (error) {
    return next(error)
  }
}
