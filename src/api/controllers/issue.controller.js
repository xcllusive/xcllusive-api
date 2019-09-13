import models from '../../config/sequelize'

export const list = async (req, res, next) => {
  const _mapValuesToArray = array => {
    if (array.length > 0) {
      return array.map((item, index) => ({
        key: index,
        text: item.label,
        value: item.id
      }))
    }
    return []
  }

  const {
    limit,
    listIssue
  } = req.query
  const offset = req.skip

  try {
    if (!listIssue) {
      const issue = await models.Issue.findAndCountAll({
        limit,
        offset
      })

      return res.status(201).json({
        data: issue,
        issuesAvailable: _mapValuesToArray(issue.rows),
        pageCount: issue.count,
        itemCount: Math.ceil(issue.count / req.query.limit)
      })
    } else {
      const issuesAvailable = await models.Issue.findAll({
        where: {
          id: {
            $notIn: listIssue
          }
        }
      })

      return res.status(201).json({
        issuesAvailable: _mapValuesToArray(issuesAvailable)
      })
    }
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  const {
    label
  } = req.body

  try {
    await models.Issue.create({
      label,
      createdBy_id: req.user.id
    })

    return res.status(200).json({
      message: `${label} created`
    })
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  const {
    label,
    closed
  } = req.body

  const {
    issueId: id
  } = req.params

  try {
    await models.Issue.update({
      label,
      closed,
      modifiedBy_id: req.user.id
    }, {
      where: {
        id
      }
    })

    return res.status(200).json({
      message: `${label} updated`
    })
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  const {
    registerType
  } = req.body

  const {
    businessRegister: id
  } = req.params

  try {
    if (registerType === 1) {
      const existsRegisterType = await models.Business.findAll({
        raw: true,
        attributes: ['id', 'sourceId'],
        where: {
          sourceId: id
        }
      })
      if (existsRegisterType.length > 0) {
        return res.status(406).json({
          error: `You can NOT delete that! Business register ${id} has been using in one or more businesses`
        })
      }
    }

    if (registerType === 6) {
      const existsRegisterType = await models.Business.findAll({
        raw: true,
        attributes: ['id', 'sourceId'],
        where: {
          ctcSourceId: id
        }
      })
      if (existsRegisterType.length > 0) {
        return res.status(406).json({
          error: `You can NOT delete that! Business register ${id} has been using in one or more businesses`
        })
      }
    }

    if (registerType === 10) {
      const existsRegisterType = await models.Business.findAll({
        raw: true,
        attributes: ['id', 'sourceId'],
        where: {
          ctcStageId: id
        }
      })
      if (existsRegisterType.length > 0) {
        return res.status(406).json({
          error: `You can NOT delete that! Business register ${id} has been using in one or more businesses`
        })
      }
    }

    if (registerType === 1) {
      await models.BusinessSource.destroy({
        where: {
          id
        }
      })
    }
    if (registerType === 2) {
      await models.BusinessRating.destroy({
        where: {
          id
        }
      })
    }
    if (registerType === 3) {
      await models.BusinessProduct.destroy({
        where: {
          id
        }
      })
    }
    if (registerType === 4) {
      await models.BusinessIndustry.destroy({
        where: {
          id
        }
      })
    }
    if (registerType === 5) {
      await models.BusinessType.destroy({
        where: {
          id
        }
      })
    }
    if (registerType === 6) {
      await models.CtcBusinessSource.destroy({
        where: {
          id
        }
      })
    }
    if (registerType === 7) {
      await models.BusinessStage.destroy({
        where: {
          id
        }
      })
    }
    if (registerType === 8) {
      await models.BusinessStageNotSigned.destroy({
        where: {
          id
        }
      })
    }
    if (registerType === 9) {
      await models.BusinessStageNotWant.destroy({
        where: {
          id
        }
      })
    }
    if (registerType === 10) {
      await models.CtcBusinessStage.destroy({
        where: {
          id
        }
      })
    }
    if (!registerType) {
      throw new Error(`Business register ${registerType} does not exist`)
    }

    return res
      .status(200)
      .json({
        message: `Business register ${id} removed with success`
      })
  } catch (error) {
    return next(error)
  }
}
