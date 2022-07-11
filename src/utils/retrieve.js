// utils -> retrieve

import axios from 'axios'

import logger from './logger.js'

import { getRequestOptions } from '../config.js'

const defaultAcceptedContentTypes = [
  'text/xml',
  'application/xml',
  'application/atom+xml',
  'application/rss+xml',
  'application/x-rss+xml'
];

export default async (url) => {

  if (typeof url != 'string') {
      const error = new Error(`url should be a string`)
      return {error}
  }

  const acceptedContentTypes = getRequestOptions().acceptedContentTypes || defaultAcceptedContentTypes;

  try {
    const res = await axios.get(url, getRequestOptions())
    
    let contentType = res.headers['content-type'] || ''
    // text/xml;charset= ..
    contentType = contentType.split(';')[0];

    if (!contentType || acceptedContentTypes.indexOf(contentType) === -1) {
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
