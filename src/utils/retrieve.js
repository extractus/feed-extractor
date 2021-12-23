// utils -> retrieve

const axios = require('axios')

const logger = require('./logger')

const { getRequestOptions } = require('../config')

module.exports = async (url) => {
  try {
    const res = await axios.get(url, getRequestOptions())

    const contentType = res.headers['content-type'] || ''
    if (!contentType || !contentType.includes('xml')) {
      logger.error(`Got invalid content-type (${contentType}) from "${url}"`)
      return null
    }
    const result = {
      url,
      xml: res.data
    }
    return result
  } catch (err) {
    logger.error(err.message || err)
    return null
  }
}
