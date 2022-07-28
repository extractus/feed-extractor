// normalizer

import {
  stripTags,
  truncate
} from 'bellajs'

import { getReaderOptions } from '../config.js'

export const toISODateString = (dstr) => {
  try {
    return dstr ? (new Date(dstr)).toISOString() : ''
  } catch (err) {
    return ''
  }
}

export const buildDescription = (val) => {
  const { descriptionMaxLen } = getReaderOptions()
  const stripped = stripTags(String(val))
  return truncate(stripped, descriptionMaxLen).replace(/\n+/g, ' ')
}
