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

const runWhenComplete = (url, result = null, error = null) => {
  eventEmitter.emit('complete', url, result, error)
  return result
}

export const read = async (url) => {
  try {
    if (!isValidUrl(url)) {
      const erdata = {
        error: 'Error occurred while verifying feed URL',
        reason: 'Invalid URL'
      }
      eventEmitter.emit('error', url, erdata)
      return runWhenComplete(url, null, erdata)
    }
    const xml = await getXML(url)

    if (!validate(xml)) {
      const erdata = {
        error: 'Error occurred while validating XML format',
        reason: 'The XML document is not well-formed'
      }
      eventEmitter.emit('error', url, erdata)
      return runWhenComplete(url, null, erdata)
    }

    try {
      const feed = parse(xml)
      if (feed) {
        eventEmitter.emit('success', url, feed)
      }

      return runWhenComplete(url, feed)
    } catch (er) {
      const erdata = {
        error: 'Error occurred while parsing XML structure',
        reason: er.message
      }
      eventEmitter.emit('error', url, erdata)

      return runWhenComplete(url, null, erdata)
    }
  } catch (err) {
    const erdata = {
      error: 'Error occurred while retrieving remote XML data',
      reason: err.message
    }
    eventEmitter.emit('error', url, erdata)
    return runWhenComplete(url, null, erdata)
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
