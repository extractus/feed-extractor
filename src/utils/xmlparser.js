// utils / xmlparser

import { hasProperty, isString } from '@ndaidong/bellajs'

import { XMLValidator, XMLParser } from 'fast-xml-parser'

export const isRSS = (data = {}) => {
  return hasProperty(data, 'rss') && hasProperty(data.rss, 'channel')
}

export const isAtom = (data = {}) => {
  return hasProperty(data, 'feed') && hasProperty(data.feed, 'entry')
}

export const isRdf = (data = {}) => {
  return hasProperty(data, 'rdf:RDF') && hasProperty(data['rdf:RDF'], 'channel')
}

export const validate = (xml) => {
  return (!isString(xml) || !xml.length) ? false : XMLValidator.validate(xml) === true
}

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
