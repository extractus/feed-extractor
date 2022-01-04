// utils / validator

import { hasProperty } from 'bellajs'
import { XMLValidator } from 'fast-xml-parser'

export const isRSS = (data = {}) => {
  return hasProperty(data, 'rss') && hasProperty(data.rss, 'channel')
}

export const isAtom = (data = {}) => {
  return hasProperty(data, 'feed') && hasProperty(data.feed, 'entry')
}

export const validate = (xml = '') => {
  const result = XMLValidator.validate(xml)
  return result === true
}
