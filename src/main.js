// main.js

import { isValid as isValidUrl } from './utils/linker.js'

import retrieve from './utils/retrieve.js'
import { validate, xml2obj, isRSS, isAtom, isRdf } from './utils/xmlparser.js'
import parseJsonFeed from './utils/parseJsonFeed.js'
import parseRssFeed from './utils/parseRssFeed.js'
import parseAtomFeed from './utils/parseAtomFeed.js'
import parseRdfFeed from './utils/parseRdfFeed.js'

/**
 * Normalize parser options with defaults.
 *
 * @param {Object} [options={}] - User-provided parser options
 * @returns {Object} Normalized options with defaults applied
 */
const getopt = (options = {}) => {
  const {
    normalization = true,
    descriptionMaxLen = 250,
    useISODateFormat = true,
    xmlParserOptions = {},
    baseUrl = '',
    getExtraFeedFields = () => ({}),
    getExtraEntryFields = () => ({}),
  } = options

  return {
    normalization,
    descriptionMaxLen,
    useISODateFormat,
    xmlParserOptions,
    baseUrl,
    getExtraFeedFields,
    getExtraEntryFields,
  }
}

/**
 * Extract feed data from a JSON string/object.
 *
 * @param {Object|string} json - JSON Feed data
 * @param {Object} [options={}] - Parser options
 * @returns {Object} Normalized feed data
 */
export const extractFromJson = (json, options = {}) => {
  return parseJsonFeed(json, getopt(options))
}

/**
 * Extract feed data from an XML string.
 *
 * Automatically detects RSS 2.0, Atom, and RDF/RSS 1.0 formats.
 *
 * @param {string} xml - XML feed string
 * @param {Object} [options={}] - Parser options
 * @returns {Object} Normalized feed data
 * @throws {Error} If XML is not well-formed or format is unrecognized
 */
export const extractFromXml = (xml, options = {}) => {
  if (!validate(xml)) {
    throw new Error('The XML document is not well-formed')
  }

  const opts = getopt(options)

  const data = xml2obj(xml, opts.xmlParserOptions)

  const result = isRSS(data)
    ? parseRssFeed(data, opts)
    : isAtom(data)
      ? parseAtomFeed(data, opts)
      : isRdf(data)
        ? parseRdfFeed(data, opts)
        : null
  if (!result) {
    throw new Error('Unrecognized feed format')
  }
  return result
}

/**
 * Fetch and extract feed data from a URL.
 *
 * Supports RSS, Atom, RDF, and JSON Feed formats.
 * Automatically detects content type and dispatches to the appropriate parser.
 *
 * @param {string} url - Feed source URL
 * @param {Object} [options={}] - Parser options (normalization, date format, etc.)
 * @param {Function} [fetcher] - Custom fetch function (url) => Promise<Response>. Defaults to globalThis.fetch.
 * @returns {Promise<Object>} Normalized feed data
 * @throws {Error} On invalid URL, fetch failure, or parse failure
 */
export const extract = async (url, options = {}, fetcher = globalThis.fetch) => {
  if (!isValidUrl(url)) {
    throw new Error('Input param must be a valid URL')
  }

  const data = await retrieve(url, fetcher)
  if (!data.text && !data.json) {
    throw new Error(`Failed to load content from "${url}"`)
  }

  const { type, json, text } = data

  return type === 'json' ? extractFromJson(json, options) : extractFromXml(text, options)
}

/**
 * Deprecated. Use {@link extract} instead.
 *
 * @param {string} url - Feed source URL
 * @param {Object} [options] - Parser options
 * @param {Function} [fetcher] - Custom fetch function
 * @returns {Promise<Object>} Normalized feed data
 * @deprecated Since v7.0. Use `extract()` instead
 */
export const read = async (url, options, fetcher) => {
  console.warn('WARNING: read() is deprecated. Please use extract() instead!')
  return extract(url, options, fetcher)
}
