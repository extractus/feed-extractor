/**
 * Feed Reader
 * @ndaidong
 **/

import { isValid as isValidUrl } from './utils/linker.js'

import retrieve from './utils/retrieve.js'
import { validate, xml2obj, isRSS, isAtom } from './utils/xmlparser.js'
import parseJsonFeed from './utils/parseJsonFeed.js'
import parseRssFeed from './utils/parseRssFeed.js'
import parseAtomFeed from './utils/parseAtomFeed.js'

export const read = async (url, options = {}) => {
  if (!isValidUrl(url)) {
    throw new Error('Input param must be a valid URL')
  }
  const data = await retrieve(url)
  if (!data.text && !data.json) {
    throw new Error(`Failed to load content from "${url}"`)
  }

  const { type, json, text } = data

  const {
    includeEntryContent = false,
    includeOptionalElements = false,
    useISODateFormat = true,
    normalization = true,
    descriptionMaxLen = 210
  } = options

  const opts = {
    normalization,
    includeEntryContent,
    includeOptionalElements,
    useISODateFormat,
    descriptionMaxLen
  }

  if (type === 'json') {
    return parseJsonFeed(json, opts)
  }

  if (!validate(text)) {
    throw new Error('The XML document is not well-formed')
  }

  const xml = xml2obj(text)
  return isRSS(xml)
    ? parseRssFeed(xml, opts)
    : isAtom(xml)
      ? parseAtomFeed(xml, opts)
      : null
}
