// utils -> retrieve

const got = require('got')

const {
  error,
  info
} = require('./logger')

const { name, version } = require('../../package.json')

const fetchOptions = {
  headers: {
    'user-agent': `${name}/${version}`
  },
  timeout: 30 * 1e3,
  redirect: 'follow'
}

module.exports = async (url) => {
  try {
    info(`Start loading feed content from "${url}"`)
    const res = await got(url, fetchOptions)
    const contentType = res.headers['content-type'] || ''
    if (!contentType || !contentType.includes('xml')) {
      error(`Got invalid content-type (${contentType}) from "${url}"`)
      return null
    }

    info(`Loaded remote feed content from "${url}"`)
    const xml = res.body

    const result = {
      url,
      xml
    }

    return result
  } catch (err) {
    error(err)
  }
  return null
}
