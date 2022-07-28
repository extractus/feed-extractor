// utils -> retrieve

import axios from 'axios'
import { isObject } from 'bellajs'

import { getRequestOptions } from '../config.js'

export default async (url) => {
  try {
    const res = await axios.get(url, getRequestOptions())
    const contentType = res.headers['content-type']
    const { data, status } = res
    return isObject(data)
      ? { type: 'json', json: data, status, contentType }
      : { type: 'xml', text: data.trim(), status, contentType }
  } catch (err) {
    throw new Error(`${err.name}: ${err.message}`)
  }
}
