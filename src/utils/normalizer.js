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

export const toISODateString = (dstr) => {
  try {
    return dstr ? (new Date(dstr)).toISOString() : ''
  } catch (err) {
    return ''
  }
}

export const buildDescription = (val, maxlen) => {
  const stripped = stripTags(String(val))
  return truncate(stripped, maxlen).replace(/\n+/g, ' ')
}

export const getText = (val) => {
  const txt = isObject(val) ? (val._text || val['#text'] || val._cdata || val.$t) : val
  return txt ? decode(String(txt).trim()) : ''
}

export const getLink = (val = [], id = '') => {
  if (id && isValidUrl(id)) {
    return id
  }
  if (isObject(id) && hasProperty(id, '@_isPermaLink') && id['@_isPermaLink'] === 'true') {
    return getText(id)
  }
  const getEntryLink = (links) => {
    const items = links.map((item) => {
      return getLink(item)
    })
    return items.length > 0 ? items[0] : ''
  }
  return isString(val)
    ? getText(val)
    : isObject(val) && hasProperty(val, 'href')
      ? getText(val.href)
      : isObject(val) && hasProperty(val, '@_href')
        ? getText(val['@_href'])
        : isObject(val) && hasProperty(val, '@_url')
          ? getText(val['@_url'])
          : isObject(val) && hasProperty(val, '_attributes')
            ? getText(val._attributes.href)
            : isArray(val) ? getEntryLink(val) : ''
}

export const getPureUrl = (url, id = '') => {
  const link = getLink(url, id)
  return link ? purifyUrl(link) : ''
}

const hash = (str) => Math.abs(str.split('').reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0)).toString(36)

export const getEntryId = (id, url, pubDate) => {
  return id ? getText(id) : hash(getPureUrl(url)) + '-' + (new Date(pubDate)).getTime()
}

export const getEnclosure = (val) => {
  const url = hasProperty(val, '@_url') ? val['@_url'] : ''
  const type = hasProperty(val, '@_type') ? val['@_type'] : ''
  const length = Number(hasProperty(val, '@_length') ? val['@_length'] : 0)
  return !url || !type
    ? null
    : {
      url,
      type,
      length,
    }
}

const getCategory = (v) => {
  return isObject(v)
    ? {
      text: getText(v),
      domain: v['@_domain'],
    }
    : v
}

export const getOptionalTags = (val, key) => {
  if (key === 'source') {
    return {
      text: getText(val),
      url: getLink(val),
    }
  }
  if (key === 'category') {
    return isArray(val) ? val.map(getCategory) : getCategory(val)
  }
  if (key === 'enclosure') {
    return getEnclosure(val)
  }
  return val
}
