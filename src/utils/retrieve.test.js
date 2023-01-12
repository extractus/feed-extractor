// retrieve.test
/* eslint-env jest */

import nock from 'nock'

import retrieve from './retrieve.js'

const parseUrl = (url) => {
  const re = new URL(url)
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.pathname,
  }
}

describe('test retrieve() method', () => {
  test('test retrieve with bad status code', async () => {
    const url = 'https://some.where/bad/page'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(500, 'Error 500')
    expect(retrieve(url)).rejects.toThrow(new Error('Request failed with error code 500'))
  })

  test('test retrieve with bad conten type', async () => {
    const url = 'https://some.where/bad/page'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, '<?xml version="1.0"?><tag>this is xml</tag>', {
      'Content-Type': 'something/type',
    })
    expect(retrieve(url)).rejects.toThrow(new Error('Invalid content type: something/type'))
  })

  test('test retrieve from good source', async () => {
    const url = 'https://some.where/good/page'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, '<div>this is content</div>', {
      'Content-Type': 'application/rss+xml',
    })
    const result = await retrieve(url)
    expect(result.type).toEqual('xml')
    expect(result.text).toEqual('<div>this is content</div>')
  })

  test('test retrieve from good source, but having \\r\\n before/after root xml', async () => {
    const url = 'https://some.where/good/page'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, '\n\r\r\n\n<div>this is content</div>\n\r\r\n\n', {
      'Content-Type': 'text/xml',
    })
    const result = await retrieve(url)
    expect(result.type).toEqual('xml')
    expect(result.text).toBe('<div>this is content</div>')
  })

  test('test retrieve using proxy', async () => {
    const url = 'https://some.where/good/source-with-proxy'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, 'something bad', {
      'Content-Type': 'bad/thing',
    })
    nock('https://proxy-server.com')
      .get('/api/proxy?url=https%3A%2F%2Fsome.where%2Fgood%2Fsource-with-proxy')
      .reply(200, '<?xml version="1.0"?><tag>this is xml</tag>', {
        'Content-Type': 'text/xml',
      })

    const result = await retrieve(url, {
      proxy: {
        target: 'https://proxy-server.com/api/proxy?url=',
      },
    })
    expect(result.type).toEqual('xml')
    expect(result.text).toEqual('<?xml version="1.0"?><tag>this is xml</tag>')
    nock.cleanAll()
  })
})
