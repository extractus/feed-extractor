// main.js

import { isValid as isValidUrl } from './utils/linker.js'

import retrieve from './utils/retrieve.js'
import { validate, xml2obj, isRSS, isAtom } from './utils/xmlparser.js'
import parseJsonFeed from './utils/parseJsonFeed.js'
import parseRssFeed from './utils/parseRssFeed.js'
import parseAtomFeed from './utils/parseAtomFeed.js'

const getopt = (options = {}) => {
  const {
    normalization = true,
    descriptionMaxLen = 210,
    useISODateFormat = true,
    xmlParserOptions = {},
    getExtraFeedFields = () => ({}),
    getExtraEntryFields = () => ({}),
  } = options

  return {
    normalization,
    descriptionMaxLen,
    useISODateFormat,
    xmlParserOptions,
    getExtraFeedFields,
    getExtraEntryFields,
  }
}

export const extractFromJson = (json, options = {}, hostname = '') => {
  return parseJsonFeed(json, getopt(options), hostname)
}

export const extractFromXml = (xml, options = {}, hostname = '') => {
  if (!validate(xml)) {
    throw new Error('The XML document is not well-formed')
  }

  const opts = getopt(options)

  const data = xml2obj(xml, opts.xmlParserOptions)
  return isRSS(data)
    ? parseRssFeed(data, opts, hostname)
    : isAtom(data)
      ? parseAtomFeed(data, opts, hostname)
      : null
}

export const extract = async (url, options = {}, fetchOptions = {}) => {
  if (!isValidUrl(url)) {
    throw new Error('Input param must be a valid URL')
  }

  const u = new URL(url)
  const hostname = u.protocol + '//' + u.hostname
  const data = await retrieve(url, fetchOptions)
  if (!data.text && !data.json) {
    throw new Error(`Failed to load content from "${url}"`)
  }

  const { type, json, text } = data

  return type === 'json' ? extractFromJson(json, options, hostname) : extractFromXml(text, options, hostname)
}

export const read = async (url, options, fetchOptions) => {
  console.warn('WARNING: read() is deprecated. Please use extract() instead!')
  return extract(url, options, fetchOptions)
}
