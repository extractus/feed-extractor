// utils -> retrieve

import { XMLParser } from 'fast-xml-parser'

/**
 * Fetch feed content through a proxy endpoint.
 *
 * Appends the target URL as an encoded query param to the proxy target.
 * Merges request headers with proxy-specific headers.
 *
 * @param {string} url - Feed URL to fetch
 * @param {Object} [options={}] - Fetch options including proxy config, headers, agent, signal
 * @returns {Promise<Response>} Fetch response object
 */
const profetch = async (url, options = {}) => {
  const { proxy = {}, headers = {}, agent = null, signal = null } = options
  const {
    target,
    headers: proxyHeaders = {},
  } = proxy
  const res = await fetch(target + encodeURIComponent(url), {
    headers: { ...headers, ...proxyHeaders },
    agent,
    signal,
  })
  return res
}

/**
 * Extract charset encoding from the first line of an XML document.
 *
 * @param {string} text - Raw XML text
 * @returns {string} Detected charset or 'utf8'
 */
const getCharsetFromText = (text) => {
  try {
    const firstLine = text.split('\n')[0].trim().replace('<?', '<').replace('?>', '>')
    const parser = new XMLParser({
      ignoreAttributes: false,
    })
    let obj = parser.parse(firstLine)
    const { xml: root = {} } = obj
    return root['@_encoding'] || 'utf8'
  } catch {
    return 'utf8'
  }
}

/**
 * Fetch and detect feed content from a URL.
 *
 * Returns structured data indicating whether the response is XML or JSON,
 * along with decoded text and content metadata.
 *
 * @param {string} url - Feed URL to retrieve
 * @param {Object} [options={}] - Fetch options (headers, proxy, agent, signal)
 * @returns {Promise<Object>} Object with `type`, `text` or `json`, `status`, `contentType`
 * @throws {Error} On HTTP errors, invalid content types, or parse failures
 */
export default async (url, options = {}) => {
  const {
    headers = {
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
    },
    proxy = null,
    agent = null,
    signal = null,
  } = options

  const res = proxy
    ? await profetch(url, { proxy, headers, agent, signal })
    : await fetch(url, { headers, agent, signal })

  const status = res.status
  if (status >= 400) {
    throw new Error(`Request failed with error code ${status}`)
  }
  const contentType = res.headers.get('content-type')
  const buffer = await res.arrayBuffer()
  const text = buffer ? new TextDecoder().decode(buffer).trim() : ''

  if (/(\+|\/)json/.test(contentType)) {
    try {
      const data = JSON.parse(text)
      return { type: 'json', json: data, status, contentType }
    } catch {
      throw new Error('Failed to convert data to JSON object')
    }
  }

  const arr = contentType.split('charset=')
  let charset = arr.length === 2 ? arr[1].trim() : getCharsetFromText(text)
  const decoder = new TextDecoder(charset)
  const xml = decoder.decode(buffer)

  const startTokens = [
    '<?xml',
    '<rss/',
    '<feed/',
    '<rdf:',
  ]

  if (/(\+|\/)(xml|html)/.test(contentType) || startTokens.some(x => xml.startsWith(x))) {
    return { type: 'xml', text: xml.trim(), status, contentType }
  }

  throw new Error(`Invalid content type: ${contentType}`)
}
