// utils -> retrieve

import axios from 'axios'

import { getRequestOptions } from '../config.js'

export default async (url) => {
  const res = await axios.get(url, getRequestOptions())
  return res.data.trim()
}
