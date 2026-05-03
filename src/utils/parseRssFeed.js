// parseRssFeed.js

// specs: https://www.rssboard.org/rss-specification

import { isArray, hasProperty } from '@pwshub/bellajs'

import {
  getText,
  toISODateString,
  buildDescription,
  getPureUrl,
  getOptionalTags,
  getEntryId
} from './normalizer.js'

/**
 * Transform a single RSS item into a normalized entry object.
 *
 * @param {Object} item - Raw RSS item from parsed XML
 * @param {Object} options - Parser options
 * @returns {Object} Normalized entry with id, title, link, published, description
 */
const transform = (item, options) => {
  const {
    useISODateFormat,
    descriptionMaxLen,
    baseUrl,
    getExtraEntryFields,
  } = options

  const {
    guid = '',
    title = '',
    link = '',
    pubDate = '',
    description = '',
    'content:encoded': content = '',
  } = item

  const published = useISODateFormat ? toISODateString(pubDate) : pubDate
  const htmlContent = getText(description || content)
  const entry = {
    id: getEntryId(guid, link, pubDate),
    title: getText(title),
    link: getPureUrl(link, guid, baseUrl),
    published,
    description: buildDescription(htmlContent, descriptionMaxLen),
  }

  const extraFields = getExtraEntryFields(item)

  return {
    ...entry,
    ...extraFields,
  }
}

/**
 * Flatten raw RSS feed data without normalization.
 *
 * Preserves original structure while cleaning text and links.
 *
 * @param {Object} feed - Raw RSS channel data
 * @param {string} baseUrl - Base URL for resolving relative links
 * @returns {Object} Feed data with cleaned entries
 */
const flatten = (feed, baseUrl) => {
  const {
    title = '',
    link = '',
    item,
  } = feed

  const items = isArray(item) ? item : [item]
  const entries = items.map((entry) => {
    const {
      id,
      title = '',
      link = '',
    } = entry

    const item = {
      ...entry,
      title: getText(title),
      link: getPureUrl(link, id, baseUrl),
    }

    const txtTags = 'guid description'.split(' ')

    txtTags.forEach((key) => {
      if (hasProperty(entry, key)) {
        item[key] = getText(entry[key])
      }
    })

    const optionalProps = 'source category enclosure author image'.split(' ')
    optionalProps.forEach((key) => {
      if (hasProperty(item, key)) {
        item[key] = getOptionalTags(item[key], key)
      }
    })

    return item
  })

  const output = {
    ...feed,
    title: getText(title),
    link: getPureUrl(link, '', baseUrl),
    item: isArray(item) ? entries : entries[0],
  }
  return output
}

/**
 * Parse and normalize RSS 2.0 feed data into a standard structure.
 *
 * When `normalization` is false, returns flattened raw data instead.
 *
 * @param {Object} data - Parsed RSS XML object
 * @param {Object} [options={}] - Parser options
 * @returns {Object} Normalized feed object with entries array
 */
const parseRss = (data, options = {}) => {
  const {
    normalization,
    baseUrl,
    getExtraFeedFields,
  } = options

  const feedData = data.rss.channel

  if (!normalization) {
    return flatten(feedData, baseUrl)
  }

  const {
    title = '',
    link = '',
    description = '',
    generator = '',
    language = '',
    lastBuildDate = '',
    item = [],
  } = feedData

  const extraFields = getExtraFeedFields(feedData)

  const items = isArray(item) ? item : [item]

  const published = options.useISODateFormat ? toISODateString(lastBuildDate) : lastBuildDate

  return {
    title: getText(title),
    link: getPureUrl(link, '', baseUrl),
    description: getText(description),
    language,
    generator,
    published,
    ...extraFields,
    entries: items.map((item) => {
      return transform(item, options)
    }),
  }
}

/**
 * Parse RSS 2.0 feed data from a parsed XML object.
 *
 * @param {Object} data - Parsed RSS XML object
 * @param {Object} [options={}] - Parser options
 * @returns {Object} Normalized or flattened feed data
 */
export default (data, options = {}) => {
  return parseRss(data, options)
}
