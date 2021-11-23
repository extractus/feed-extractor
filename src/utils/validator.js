// utils / validator

const { hasProperty } = require('bellajs')
const { XMLValidator } = require('fast-xml-parser')

const isRSS = (data = {}) => {
  return hasProperty(data, 'rss') && hasProperty(data.rss, 'channel')
}

const isAtom = (data = {}) => {
  return hasProperty(data, 'feed') && hasProperty(data.feed, 'entry')
}

const validate = (xml = '') => {
  const result = XMLValidator.validate(xml)
  return result === true
}

module.exports = {
  isRSS,
  isAtom,
  validate
}
