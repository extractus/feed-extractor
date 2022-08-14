// parseAtomFeed.js

// specs: https://datatracker.ietf.org/doc/html/rfc5023
// refer: https://validator.w3.org/feed/docs/atom.html

import { isArray } from 'bellajs'

import {
  getText,
  toISODateString,
  buildDescription,
  getPureUrl
} from './normalizer.js'

import { getReaderOptions } from '../config.js'

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
  const htmlContent = getText(content || summary)
  const entry = {
    title: getText(title),
    link: getPureUrl(link, id),
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
    link: getPureUrl(link, id),
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
