// utils -> retrieve

import { XMLParser } from 'fast-xml-parser'

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
 * @param {Function} fetcher - Fetch function (url) => Promise<Response>
 * @returns {Promise<Object>} Object with `type`, `text` or `json`, `status`, `contentType`
 * @throws {Error} On HTTP errors, invalid content types, or parse failures
 */
export default async (url, fetcher) => {
  const res = await fetcher(url)

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
