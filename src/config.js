// configs

import { clone, copies } from 'bellajs'

const requestOptions = {
  headers: {
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
    'accept-encoding': '*'
  },
  responseType: 'text',
  responseEncoding: 'utf8',
  timeout: 3e4, // 30 seconds
  maxRedirects: 5
}

const readerOptions = {
  descriptionMaxLen: 210, // max num of chars for description
  includeFullContent: false,
  convertPubDateToISO: true
}

export const getRequestOptions = () => {
  return clone(requestOptions)
}

export const setRequestOptions = (opts) => {
  copies(opts, requestOptions)
}

export const getReaderOptions = () => {
  return clone(readerOptions)
}

export const setReaderOptions = (opts) => {
  copies(opts, readerOptions)
}
