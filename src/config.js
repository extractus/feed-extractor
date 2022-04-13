// configs

import { clone, copies } from 'bellajs'

const requestOptions = {
  headers: {
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0',
    'accept': 'application/rss+xml, application/atom+xml'
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
