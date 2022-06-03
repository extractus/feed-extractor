// configs

import { clone, copies } from 'bellajs'

const requestOptions = {
  headers: {
    'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:100.0) Gecko/20100101 Firefox/100.0'
  },
  responseType: 'text',
  responseEncoding: 'utf8',
  timeout: 6e4, // 1 minute
  maxRedirects: 3
}

export const getRequestOptions = () => {
  return clone(requestOptions)
}

export const setRequestOptions = (opts) => {
  copies(opts, requestOptions)
}
