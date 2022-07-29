// normalizer

import {
  isString,
  isObject,
  isArray,
  hasProperty,
  stripTags,
  truncate
} from 'bellajs'

import { decode } from 'html-entities'

import { isValid as isValidUrl, purify as purifyUrl } from './linker.js'

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

export const getText = (val) => {
  const txt = isObject(val) ? (val._text || val['#text'] || val._cdata || val.$t) : val
  return txt ? decode(String(txt).trim()) : ''
}

export const getLink = (val = [], id = '') => {
  if (id && isValidUrl(id)) {
    return id
  }
  const getEntryLink = (links) => {
    const items = links.map((item) => {
      return getLink(item)
    })
    return items.length > 0 ? items[0] : null
  }
  return isString(val)
    ? getText(val)
    : isObject(val) && hasProperty(val, 'href')
      ? getText(val.href)
      : isObject(val) && hasProperty(val, '@_href')
        ? getText(val['@_href'])
        : isObject(val) && hasProperty(val, '_attributes')
          ? getText(val._attributes.href)
          : isArray(val) ? getEntryLink(val) : null
}

export const getPureUrl = (url, id = '') => {
  const link = getLink(url, id)
  return purifyUrl(link)
}
