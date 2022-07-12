// configs

import { clone, copies } from 'bellajs'

const requestOptions = {
  headers: {
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
    'accept-encoding': 'deflate,zlib,gzip'
  },
  responseType: 'text',
  responseEncoding: 'utf8',
  timeout: 6e4, // 1 minute
  maxRedirects: 5
}

export const getRequestOptions = () => {
  return clone(requestOptions)
}

export const setRequestOptions = (opts) => {
  copies(opts, requestOptions)
}
