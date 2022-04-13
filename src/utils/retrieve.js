// utils -> retrieve

import logger from './logger.js'

import { getRequestOptions } from '../config.js'
import axios from 'axios';

export default async (url, requestFn = (url, getRequestOptions) => axios.get(url, getRequestOptions())) => {
  try {
    const res = await requestFn(url, getRequestOptions);

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
