// utils / xml2obj

import { XMLParser } from 'fast-xml-parser/src/fxp.js'

import { info } from './logger.js'

export default (xml = '') => {
  const options = {
    ignoreAttributes: false
  }
  info('Parsing XML data...')
  const parser = new XMLParser(options)
  const jsonObj = parser.parse(xml)
  return jsonObj
}
