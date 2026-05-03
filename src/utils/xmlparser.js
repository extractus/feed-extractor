// utils / xmlparser

import { hasProperty, isString } from '@pwshub/bellajs'

import { XMLValidator, XMLParser } from 'fast-xml-parser'

/**
 * Check if parsed data represents an RSS 2.0 feed.
 *
 * @param {Object} [data={}] - Parsed XML object
 * @returns {boolean} True if data has `rss.channel` structure
 */
export const isRSS = (data = {}) => {
  return hasProperty(data, 'rss') && hasProperty(data.rss, 'channel')
}

/**
 * Check if parsed data represents an Atom feed.
 *
 * @param {Object} [data={}] - Parsed XML object
 * @returns {boolean} True if data has `feed.entry` structure
 */
export const isAtom = (data = {}) => {
  return hasProperty(data, 'feed') && hasProperty(data.feed, 'entry')
}

/**
 * Check if parsed data represents an RDF/RSS 1.0 feed.
 *
 * @param {Object} [data={}] - Parsed XML object
 * @returns {boolean} True if data has `rdf:RDF.channel` structure
 */
export const isRdf = (data = {}) => {
  return hasProperty(data, 'rdf:RDF') && hasProperty(data['rdf:RDF'], 'channel')
}

/**
 * Validate whether an XML string is well-formed.
 *
 * @param {string} xml - XML string to validate
 * @returns {boolean} True if XML is well-formed
 */
export const validate = (xml) => {
  return (!isString(xml) || !xml.length) ? false : XMLValidator.validate(xml) === true
}

/**
 * Parse an XML string into a JavaScript object.
 *
 * Uses fast-xml-parser with `ignoreAttributes: false` and `attributeNamePrefix: '@_'`.
 *
 * @param {string} [xml=''] - XML string to parse
 * @param {Object} [extraOptions={}] - Additional parser options
 * @returns {Object} Parsed JavaScript object
 */
export const xml2obj = (xml = '', extraOptions = {}) => {
  const options = {
    attributeNamePrefix: '@_',
    ignoreAttributes: false,
    ...extraOptions,
  }
  const parser = new XMLParser(options)
  const jsonObj = parser.parse(xml)
  return jsonObj
}
