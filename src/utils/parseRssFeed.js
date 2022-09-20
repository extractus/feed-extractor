// parseRssFeed.js

// specs: https://www.rssboard.org/rss-specification

import { isArray, hasProperty } from 'bellajs'

import {
  getText,
  toISODateString,
  buildDescription,
  getPureUrl,
  getOptionalTags
} from './normalizer.js'

const transform = (item, options) => {
  const {
    includeEntryContent,
    includeOptionalElements,
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

  if (includeOptionalElements) {
    const optionalProps = 'author comments source category enclosure'.split(' ')
    optionalProps.forEach((key) => {
      if (hasProperty(item, key)) {
        entry[key] = getOptionalTags(item[key], key)
      }
    })
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
      link = ''
    } = entry

    const item = {
      ...entry,
      title: getText(title),
      link: getPureUrl(link, id)
    }

    const txtTags = 'guid description source'.split(' ')

    txtTags.forEach((key) => {
      if (hasProperty(entry, key)) {
        item[key] = getText(entry[key])
      }
    })

    const optionalProps = 'source category enclosure'.split(' ')
    optionalProps.forEach((key) => {
      if (hasProperty(item, key)) {
        entry[key] = getOptionalTags(item[key], key)
      }
    })

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
