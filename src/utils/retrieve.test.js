// retrieve.test

import { describe, it } from 'node:test'
import assert from 'node:assert'

import retrieve from './retrieve.js'

const mockFetch = (body, contentType, status = 200) => {
  return async () => {
    return new Response(body, {
      status,
      headers: { 'content-type': contentType },
    })
  }
}

describe('test retrieve() method', () => {
  it('test retrieve with bad status code', async () => {
    const fetcher = mockFetch('Error 500', 'text/plain', 500)
    try {
      await retrieve('https://some.where/bad/page', fetcher)
    } catch (err) {
      assert.equal(err.message, 'Request failed with error code 500')
    }
  })

  it('test retrieve with bad content type', async () => {
    const fetcher = mockFetch('<?xml version="1.0"?><tag>this is xml</tag>', 'something/type')
    try {
      await retrieve('https://some.where/bad/page', fetcher)
    } catch (err) {
      assert.equal(err.message, 'Invalid content type: something/type')
    }
  })

  it('test retrieve xml from good source', async () => {
    const fetcher = mockFetch('<div>this is content</div>', 'application/rss+xml')
    const result = await retrieve('https://some.where/good/page', fetcher)
    assert.equal(result.type, 'xml')
    assert.equal(result.text, '<div>this is content</div>')
  })

  it('test retrieve xml with whitespace around root', async () => {
    const fetcher = mockFetch('\n\r\r\n\n<div>this is content</div>\n\r\r\n\n', 'text/xml')
    const result = await retrieve('https://some.where/good/page', fetcher)
    assert.equal(result.type, 'xml')
    assert.equal(result.text, '<div>this is content</div>')
  })

  it('test retrieve json from good source', async () => {
    const jsonBody = JSON.stringify({ title: 'test feed', items: [] })
    const fetcher = mockFetch(jsonBody, 'application/json')
    const result = await retrieve('https://some.where/good/json', fetcher)
    assert.equal(result.type, 'json')
    assert.equal(result.json.title, 'test feed')
  })

  it('test retrieve using custom fetcher (proxy)', async () => {
    const fetcher = async () => {
      return new Response('<?xml version="1.0"?><tag>this is xml</tag>', {
        status: 200,
        headers: { 'content-type': 'text/xml' },
      })
    }
    const result = await retrieve('https://some.where/good/source', fetcher)
    assert.equal(result.type, 'xml')
    assert.equal(result.text, '<?xml version="1.0"?><tag>this is xml</tag>')
  })

  it('test retrieve with custom headers via fetcher', async () => {
    let capturedUrl = ''
    const fetcher = async (url) => {
      capturedUrl = url
      return new Response('<rss><channel><title>test</title></channel></rss>', {
        status: 200,
        headers: { 'content-type': 'application/rss+xml' },
      })
    }
    const result = await retrieve('https://some.where/rss', fetcher)
    assert.equal(result.type, 'xml')
    assert.equal(capturedUrl, 'https://some.where/rss')
  })
})
