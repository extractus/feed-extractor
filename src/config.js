// configs

const { clone, copies } = require('bellajs')

const requestOptions = {
  headers: {
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0'
  },
  responseType: 'text',
  responseEncoding: 'utf8',
  timeout: 6e4, // 1 minute
  maxRedirects: 3
}

module.exports = {
  getRequestOptions: () => {
    return clone(requestOptions)
  },
  setRequestOptions: (opts) => {
    copies(opts, requestOptions)
  }
}
