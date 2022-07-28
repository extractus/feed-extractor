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

export {
  getRequestOptions,
  setRequestOptions,
  getReaderOptions,
  setReaderOptions
} from './config.js'

export const read = async (url) => {
  if (!isValidUrl(url)) {
    throw new Error('Input param must be a valid URL')
  }
  const data = await retrieve(url)
  if (!data.text && !data.json) {
    throw new Error(`Failed to load content from "${url}"`)
  }

  const { type, json, text } = data

  if (type === 'json') {
    return parseJsonFeed(json)
  }

  if (!validate(text)) {
    throw new Error('The XML document is not well-formed')
  }

  const xml = xml2obj(text)
  return isRSS(xml)
    ? parseRssFeed(xml)
    : isAtom(xml)
      ? parseAtomFeed(xml)
      : null
}
