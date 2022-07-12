/**
 * Feed Reader
 * @ndaidong
 **/

import EventEmitter from 'events'

import getXML from './utils/retrieve.js'
import { parse } from './utils/parser.js'

import isValidUrl from './utils/isValidUrl.js'
import { validate } from './utils/validator.js'

export {
  getRequestOptions,
  setRequestOptions
} from './config.js'

const eventEmitter = new EventEmitter()

const runWhenComplete = (result, url) => {
  eventEmitter.emit('complete', result, url)
  return result
}

export const read = async (url) => {
  try {
    if (!isValidUrl(url)) {
      eventEmitter.emit('error', {
        error: 'Error occurred while verifying feed URL',
        reason: 'Invalid URL'
      }, url)

      return runWhenComplete(null, url)
    }
    const xml = await getXML(url)

    if (!validate(xml)) {
      eventEmitter.emit('error', {
        error: 'Error occurred while validating XML format',
        reason: 'The XML document is not well-formed'
      }, url)

      return runWhenComplete(null, url)
    }

    try {
      const feed = parse(xml)
      if (feed) {
        eventEmitter.emit('success', feed, url)
      }

      return runWhenComplete(feed, url)
    } catch (er) {
      eventEmitter.emit('error', {
        error: 'Error occurred while parsing XML structure',
        reason: er.message
      }, url)

      return runWhenComplete(null, url)
    }
  } catch (err) {
    eventEmitter.emit('error', {
      error: 'Error occurred while retrieving remote XML data',
      reason: err.message
    }, url)

    return runWhenComplete(null, url)
  }
}

export const onComplete = (fn) => {
  eventEmitter.on('complete', fn)
}

export const onSuccess = (fn) => {
  eventEmitter.on('success', fn)
}

export const onError = (fn) => {
  eventEmitter.on('error', fn)
}

export const resetEvents = () => {
  eventEmitter.removeAllListeners()
}
