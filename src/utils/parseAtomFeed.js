// parseAtomFeed.js

// specs: https://datatracker.ietf.org/doc/html/rfc5023
// refer: https://validator.w3.org/feed/docs/atom.html

import { isArray, hasProperty } from '@ndaidong/bellajs'

import {
  getText,
  toISODateString,
  buildDescription,
  getPureUrl,
  getEntryId
} from './normalizer.js'

/**
 * Transform a single Atom entry into a normalized entry object.
 *
 * @param {Object} item - Raw Atom entry from parsed XML
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
    id = '',
    title = '',
    issued = '',
    modified = '',
    updated = '',
    published = '',
    link = '',
    summary = '',
    content = '',
  } = item

  const pubDate = updated || modified || published || issued
  const htmlContent = getText(summary || content)
  const entry = {
    id: getEntryId(id, link, pubDate),
    title: getText(title),
    link: getPureUrl(link, id, baseUrl),
    published: useISODateFormat ? toISODateString(pubDate) : pubDate,
    description: buildDescription(htmlContent, descriptionMaxLen),
  }

  const extraFields = getExtraEntryFields(item)

  return {
    ...entry,
    ...extraFields,
  }
}

/**
 * Flatten raw Atom feed data without normalization.
 *
 * Preserves original structure while cleaning text and links.
 *
 * @param {Object} feed - Raw Atom feed data
 * @param {string} baseUrl - Base URL for resolving relative links
 * @returns {Object} Feed data with cleaned entries
 */
const flatten = (feed, baseUrl) => {
  const {
    id,
    title = '',
    link = '',
    entry,
  } = feed

  const entries = isArray(entry) ? entry : [entry]
  const items = entries.map((entry) => {
    const {
      id,
      title = '',
      link = '',
      summary = '',
      content = '',
    } = entry
    const item = {
      ...entry,
      title: getText(title),
      link: getPureUrl(link, id, baseUrl),
    }
    if (hasProperty(item, 'summary')) {
      item.summary = getText(summary)
    }
    if (hasProperty(item, 'content')) {
      item.content = getText(content)
    }
    return item
  })

  const output = {
    ...feed,
    title: getText(title),
    link: getPureUrl(link, id, baseUrl),
    entry: isArray(entry) ? items : items[0],
  }
  return output
}

/**
 * Parse and normalize Atom feed data into a standard structure.
 *
 * When `normalization` is false, returns flattened raw data instead.
 * Extracts language from `xml:lang` attribute when present.
 *
 * @param {Object} data - Parsed Atom XML object
 * @param {Object} [options={}] - Parser options
 * @returns {Object} Normalized feed object with entries array
 */
const parseAtom = (data, options = {}) => {
  const {
    normalization,
    baseUrl,
    getExtraFeedFields,
  } = options

  const feedData = data.feed

  if (!normalization) {
    return flatten(feedData, baseUrl)
  }

  const {
    id = '',
    title = '',
    link = '',
    subtitle = '',
    generator = '',
    language = feedData.language || feedData['@_xml:lang'] || '',
    updated = '',
    entry: item = [],
  } = feedData

  const extraFields = getExtraFeedFields(feedData)

  const items = isArray(item) ? item : [item]

  const published = options.useISODateFormat ? toISODateString(updated) : updated

  return {
    title: getText(title),
    link: getPureUrl(link, id, baseUrl),
    description: getText(subtitle),
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
 * Parse Atom feed data from a parsed XML object.
 *
 * @param {Object} data - Parsed Atom XML object
 * @param {Object} [options={}] - Parser options
 * @returns {Object} Normalized or flattened feed data
 */
export default (data, options = {}) => {
  return parseAtom(data, options)
}
