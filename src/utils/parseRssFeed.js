// parseRssFeed.js

// specs: https://www.rssboard.org/rss-specification

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
    title = '',
    link = '',
    pubDate = '',
    description = ''
  } = item

  const published = convertPubDateToISO ? toISODateString(pubDate) : pubDate

  const entry = {
    title: getText(title),
    link: getPureUrl(link),
    published,
    description: buildDescription(description)
  }
  if (includeFullContent) {
    entry.content = description
  }
  return entry
}

const parseRss = (data) => {
  const {
    title = '',
    link = '',
    description = '',
    generator = '',
    language = '',
    lastBuildDate = '',
    item = []
  } = data.rss.channel

  const items = isArray(item) ? item : [item]

  const {
    includeFullContent,
    convertPubDateToISO
  } = getReaderOptions()

  return {
    title: getText(title),
    link: getPureUrl(link),
    description,
    language,
    generator,
    published: toISODateString(lastBuildDate),
    entries: items.map((item) => {
      return transform(item, includeFullContent, convertPubDateToISO)
    })
  }
}

export default (data) => {
  return parseRss(data)
}
