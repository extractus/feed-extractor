/**
 * Feed Reader
 * @ndaidong
 **/

const { info } = require('./utils/logger')

const getXML = require('./utils/retrieve')
const xml2obj = require('./utils/xml2obj')
const { parseRSS, parseAtom } = require('./utils/parser')

const {
  validate,
  isRSS,
  isAtom
} = require('./utils/validator')

const {
  getRequestOptions,
  setRequestOptions
} = require('./config')

const read = async (url) => {
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

module.exports = {
  read,
  getRequestOptions,
  setRequestOptions
}
