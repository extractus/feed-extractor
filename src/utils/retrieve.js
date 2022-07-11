// utils -> retrieve

import axios from 'axios'

import logger from './logger.js'

import { getRequestOptions } from '../config.js'

export default async (url) => {

  if (typeof url != 'string') {
      const error = new Error(`url should be a string`)
      return {error}
  }

  try {
    const res = await axios.get(url, getRequestOptions())
    
    const contentType = res.headers['content-type'] || ''
    if (!contentType || !contentType.includes('xml')) {
      logger.error(`Got invalid content-type (${contentType}) from "${url}"`)
      const error = new Error(`invalid content-type (${contentType}) from "${url}"`)
      return {error}
    }

    if (res.data === undefined) {
      const error = new Error(`something wrong append with axios`)
      return {error}
    }

    const result = {
      url,
      xml: res.data.trim(),
    }
    return result
  } catch (error) {
    logger.error(error.message || error)
    return {error}
  }
}
