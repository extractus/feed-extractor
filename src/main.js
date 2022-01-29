/**
 * Feed Reader
 * @ndaidong
 **/

import { info } from './utils/logger.js'

import getXML from './utils/retrieve.js'
import xml2obj from './utils/xml2obj.js'
import { parseRSS, parseAtom } from './utils/parser.js'

import {
  validate,
  isRSS,
  isAtom
} from './utils/validator.js'

export {
  getRequestOptions,
  setRequestOptions
} from './config.js'

export const read = async (url) => {
  const xmldata = await getXML(url)
  if (!xmldata) {
    throw new Error(`Could not fetch XML content from "${url}"`)
  }
  const { xml } = xmldata
  if (!validate(xml)) {
    throw new Error(`Failed while validating XML format from "${url}"`)
  }
  info('Parsing XML data...')
  const jsonObj = xml2obj(xml)
  return isRSS(jsonObj) ? parseRSS(jsonObj) : isAtom(jsonObj) ? parseAtom(jsonObj) : null
}
