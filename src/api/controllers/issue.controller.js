import models from '../../config/sequelize'
import APIError from '../utils/APIError'
import _ from 'lodash'

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
    listIssue,
    businessId
  } = req.query
  const offset = req.skip

  try {
    if (listIssue && !JSON.parse(listIssue)) {
      const issue = await models.Issue.findAndCountAll({
        raw: true,
        limit,
        offset
      })

      return res.status(201).json({
        data: issue,
        issuesAvailable: _mapValuesToArray(_.filter(issue.rows, array => !array.closed)),
        pageCount: issue.count,
        itemCount: Math.ceil(issue.count / req.query.limit)
      })
    } else {
      const business = await models.Business.findOne({
        raw: true,
        where: {
          id: businessId
        }
      })
      const issuesAvailable = await models.Issue.findAll({
        raw: true,
        where: {
          id: {
            $notIn: JSON.parse(business.listIssues_id)
          }
        }
      })
      return res.status(201).json({
        issuesAvailable: _mapValuesToArray(_.filter(issuesAvailable, array => !array.closed))
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
    issueId
  } = req.params

  try {
    const usingIssue = await models.Business.findOne({
      raw: true,
      where: {
        listIssues_id: {
          $like: `%${issueId}%`
        }
      }
    })
    if (usingIssue) {
      throw new APIError({
        message: 'You can NOT delete this issue! It has been using in one or more businesses',
        status: 404,
        isPublic: true
      })
    }

    await models.Issue.destroy({
      where: {
        id: issueId
      }
    })

    return res
      .status(200)
      .json({
        message: `${issueId} removed with success`
      })
  } catch (error) {
    return next(error)
  }
}
