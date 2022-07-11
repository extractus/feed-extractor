// retrieve.test
/* eslint-env jest */

import nock from 'nock'

import retrieve from './retrieve.js'

const parseUrl = (url) => {
  const re = new URL(url)
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.pathname
  }
}

test('test retrieve from good source', async () => {
  const url = 'https://some.where/good/page'
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(200)
  nock(baseUrl).get(path).reply(200, '<div>this is content</div>', {
    'Content-Type': 'application/xml'
  })
  const result = await retrieve(url)
  expect(result.xml).toBe('<div>this is content</div>')
})


test('test retrieve from good source, but having \\r\\n before/after root xml', async () => {
  const url = 'https://some.where/good/page'
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(200)
  nock(baseUrl).get(path).reply(200, '\n\r\r\n\n<div>this is content</div>\n\r\r\n\n', {
    'Content-Type': 'application/xml'
  })
  const result = await retrieve(url)
  expect(result.xml).toBe('<div>this is content</div>')
})


test('test retrieve with invalid response content type', async () => {
  const url = 'https://some.where/bad/page'
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(200)
  nock(baseUrl).get(path).reply(200, '', {
    'Content-Type': 'something/strange'
  })
  const result = await retrieve(url)
  expect(typeof result ).toBe('object')
  expect(typeof result.error ).toBe('object');
  expect(typeof result.error.message).toBe('string');
})

test('test retrieve with invalid response status code', async () => {
  const url = 'https://some.where/bad/page'
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(500)
  nock(baseUrl).get(path).reply(500, '<xml><message>Error 500</message></xml>', {
    'Content-Type': 'application/xml'
  })
  const result = await retrieve(url)
  expect(typeof result ).toBe('object')
  expect(typeof result.error ).toBe('object', result.error);
  expect(typeof result.error.message).toBe('string');
})

