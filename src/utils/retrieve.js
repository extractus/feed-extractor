// utils -> retrieve

import fetch from 'cross-fetch'

const profetch = async (url, proxy = {}) => {
  const {
    target,
    headers = {},
  } = proxy
  const res = await fetch(target + encodeURIComponent(url), {
    headers,
  })
  return res
}

export default async (url, options = {}) => {
  const {
    headers = {
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0',
    },
    proxy = null,
  } = options

  const res = proxy ? await profetch(url, proxy) : await fetch(url, { headers })

  const status = res.status
  if (status >= 400) {
    throw new Error(`Request failed with error code ${status}`)
  }
  const contentType = res.headers.get('content-type')
  const text = await res.text()

  if (/(\+|\/)(xml|html)/.test(contentType)) {
    return { type: 'xml', text: text.trim(), status, contentType }
  }

  if (/(\+|\/)json/.test(contentType)) {
    try {
      const data = JSON.parse(text)
      return { type: 'json', json: data, status, contentType }
    } catch (err) {
      throw new Error('Failed to convert data to JSON object')
    }
  }
  throw new Error(`Invalid content type: ${contentType}`)
}
