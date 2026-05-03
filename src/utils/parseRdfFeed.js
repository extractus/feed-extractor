// parseRssFeed.js

// specs: https://www.rssboard.org/rss-specification

import { isArray } from '@ndaidong/bellajs'

import {
  getText,
  toISODateString,
  buildDescription,
  getPureUrl,
  getEntryId
} from './normalizer.js'

/**
 * Transform a single RDF item into a normalized entry object.
 *
 * @param {Object} item - Raw RDF item from parsed XML
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
    'dc:date': pubDate = '',
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
 * Flatten raw RDF feed data without normalization.
 *
 * Preserves original structure while cleaning text and links.
 *
 * @param {Object} feed - Raw RDF channel data
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
 * Parse and normalize RDF/RSS 1.0 feed data into a standard structure.
 *
 * When `normalization` is false, returns flattened raw data instead.
 *
 * @param {Object} data - Parsed RDF XML object
 * @param {Object} [options={}] - Parser options
 * @returns {Object} Normalized feed object with entries array
 */
const parseRdf = (data, options = {}) => {
  const {
    normalization,
    baseUrl,
    getExtraFeedFields,
  } = options

  const feedData = data['rdf:RDF']

  if (!normalization) {
    return flatten(feedData, baseUrl)
  }

  const {
    title = '',
    link = '',
    description = '',
    generator = '',
    'dc:language': language = '',
    'dc:date': lastBuildDate = '',
  } = feedData.channel

  const { item } = feedData

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
 * Parse RDF/RSS 1.0 feed data from a parsed XML object.
 *
 * @param {Object} data - Parsed RDF XML object
 * @param {Object} [options={}] - Parser options
 * @returns {Object} Normalized or flattened feed data
 */
export default (data, options = {}) => {
  return parseRdf(data, options)
}
