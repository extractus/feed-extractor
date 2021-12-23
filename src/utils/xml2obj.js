// utils / xml2obj

const { XMLParser } = require('fast-xml-parser')

const { info } = require('./logger')

const parse = (xml = '') => {
  const options = {
    ignoreAttributes: false
  }
  info('Parsing XML data...')
  const parser = new XMLParser(options)
  const jsonObj = parser.parse(xml)
  return jsonObj
}

module.exports = parse
