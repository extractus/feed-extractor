// parseJsonFeed.js

// specs: https://www.jsonfeed.org/version/1.1/

import { isArray } from '@pwshub/bellajs'

import {
  toISODateString,
  buildDescription,
  getEntryId,
  getPureUrl
} from './normalizer.js'

import { absolutify, purify as purifyUrl } from './linker.js'

/**
 * Transform a single JSON Feed item into a normalized entry object.
 *
 * @param {Object} item - Raw JSON Feed item
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
    url: link = '',
    date_published: pubDate = '',
    summary = '',
    content_html: htmlContent = '',
    content_text: textContent = '',
  } = item

  const published = useISODateFormat ? toISODateString(pubDate) : pubDate
  const extraFields = getExtraEntryFields(item)

  const entry = {
    id: getEntryId(id, link, pubDate),
    title,
    link: getPureUrl(link, '', baseUrl),
    published,
    description: buildDescription(textContent || htmlContent || summary, descriptionMaxLen),
  }

  return {
    ...entry,
    ...extraFields,
  }
}

/**
 * Parse and normalize JSON Feed data into a standard structure.
 *
 * When `normalization` is false, returns the raw data as-is.
 * Extracts feed-level published date from `date_published` or `date_modified`.
 *
 * @param {Object} data - JSON Feed object
 * @param {Object} options - Parser options
 * @returns {Object} Normalized feed object with entries array
 */
const parseJson = (data, options) => {
  const {
    normalization,
    baseUrl,
    getExtraFeedFields,
  } = options

  if (!normalization) {
    return data
  }

  const {
    title = '',
    home_page_url: homepageUrl = '',
    date_published: pubDate = '',
    date_modified: modDate = '',
    description = '',
    language = '',
    items: item = [],
  } = data

  const extraFields = getExtraFeedFields(data)

  const items = isArray(item) ? item : [item]

  return {
    title,
    link: purifyUrl(homepageUrl) || absolutify(baseUrl, homepageUrl),
    description,
    language,
    published: pubDate || modDate,
    generator: '',
    ...extraFields,
    entries: items.map((item) => {
      return transform(item, options)
    }),
  }
}

/**
 * Parse JSON Feed data from a JSON object.
 *
 * @param {Object} data - JSON Feed object
 * @param {Object} [options={}] - Parser options
 * @returns {Object} Normalized or raw feed data
 */
export default (data, options = {}) => {
  return parseJson(data, options)
}
