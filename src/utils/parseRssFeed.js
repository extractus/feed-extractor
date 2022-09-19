// parseRssFeed.js

// specs: https://www.rssboard.org/rss-specification

import { isArray, hasProperty } from 'bellajs'

import {
  getText,
  toISODateString,
  buildDescription,
  getPureUrl
} from './normalizer.js'

const transform = (item, options) => {
  const {
    includeEntryContent,
    useISODateFormat,
    descriptionMaxLen
  } = options

  const {
    title = '',
    link = '',
    pubDate = '',
    description = ''
  } = item

  const published = useISODateFormat ? toISODateString(pubDate) : pubDate

  const entry = {
    title: getText(title),
    link: getPureUrl(link),
    published,
    description: buildDescription(description, descriptionMaxLen)
  }
  if (includeEntryContent) {
    entry.content = description
  }
  return entry
}

const flatten = (feed) => {
  const {
    title = '',
    link = '',
    item
  } = feed

  const items = isArray(item) ? item : [item]
  const entries = items.map((entry) => {
    const {
      id,
      title = '',
      link = '',
      guid = '',
      description = '',
      source = ''
    } = entry
    const item = {
      ...entry,
      title: getText(title),
      link: getPureUrl(link, id)
    }
    if (hasProperty(item, 'guid')) {
      item.guid = getText(guid)
    }
    if (hasProperty(item, 'description')) {
      item.description = getText(description)
    }
    if (hasProperty(item, 'source')) {
      item.source = getText(source)
    }
    return item
  })

  const output = {
    ...feed,
    title: getText(title),
    link: getPureUrl(link),
    item: isArray(item) ? entries : entries[0]
  }
  return output
}

const parseRss = (data, options = {}) => {
  const { normalization } = options
  if (!normalization) {
    return flatten(data.rss.channel)
  }

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

  const published = options.useISODateFormat ? toISODateString(lastBuildDate) : lastBuildDate

  return {
    title: getText(title),
    link: getPureUrl(link),
    description,
    language,
    generator,
    published,
    entries: items.map((item) => {
      return transform(item, options)
    })
  }
}

export default (data, options = {}) => {
  return parseRss(data, options)
}
