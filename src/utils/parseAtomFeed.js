// parseAtomFeed.js

// specs: https://datatracker.ietf.org/doc/html/rfc5023
// refer: https://validator.w3.org/feed/docs/atom.html

import { isString, isObject, isArray, hasProperty } from 'bellajs'
import { decode } from 'html-entities'

import {
  toISODateString,
  buildDescription
} from './normalizer.js'

import { isValid as isValidUrl, purify as purifyUrl } from './linker.js'

import { getReaderOptions } from '../config.js'

const getText = (val) => {
  const txt = isObject(val) ? (val._text || val['#text'] || val._cdata || val.$t) : val
  return txt ? decode(String(txt).trim()) : ''
}

const getLink = (val = [], id = '') => {
  if (isValidUrl(id)) {
    return purifyUrl(id)
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

const transform = (item, includeFullContent, convertPubDateToISO) => {
  const {
    id = '',
    title = '',
    updated = '',
    published = '',
    link = '',
    summary = '',
    content = ''
  } = item

  const pubDate = updated || published
  const htmlContent = getText(content)
  const entry = {
    title: getText(title),
    link: getLink(link, id),
    published: convertPubDateToISO ? toISODateString(pubDate) : pubDate,
    description: buildDescription(htmlContent || summary)
  }
  if (includeFullContent) {
    entry.content = htmlContent
  }
  return entry
}

const parseAtom = (data) => {
  const {
    id = '',
    title = '',
    link = '',
    subtitle = '',
    generator = '',
    language = '',
    updated = '',
    entry: item = []
  } = data.feed

  const items = isArray(item) ? item : [item]

  const {
    includeFullContent,
    convertPubDateToISO
  } = getReaderOptions()

  return {
    title: getText(title),
    link: getLink(link, id),
    description: subtitle,
    language,
    generator,
    published: toISODateString(updated),
    entries: items.map((item) => {
      return transform(item, includeFullContent, convertPubDateToISO)
    })
  }
}

export default (data) => {
  return parseAtom(data)
}
