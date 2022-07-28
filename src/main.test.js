// main.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import nock from 'nock'

import { hasProperty } from 'bellajs'

import { read, getReaderOptions, setReaderOptions } from './main.js'

const feedAttrs = 'title link description generator language published entries'.split(' ')
const entryAttrs = 'title link description published'.split(' ')

const defaultReaderOptions = getReaderOptions()

const parseUrl = (url) => {
  const re = new URL(url)
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.pathname
  }
}

afterAll(() => {
  return setReaderOptions(defaultReaderOptions)
})

describe('test read() function with common issues', () => {
  test('read feed from a non-string link', () => {
    expect(read([])).rejects.toThrow(new Error('Input param must be a valid URL'))
  })

  test('read feed from a 404 link', () => {
    const url = 'https://somewhere.xyz/alpha/beta'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(404)
    expect(read(url)).rejects.toThrow(new Error('AxiosError: Request failed with status code 404'))
  })

  test('read feed from empty xml', () => {
    const url = 'https://empty-source.elsewhere/rss'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, '', {
      'Content-Type': 'application/xml'
    })
    expect(read(url)).rejects.toThrow(new Error(`Failed to load content from "${url}"`))
  })

  test('read feed from invalid xml', async () => {
    const url = 'https://averybad-source.elsewhere/rss'
    const xml = '<?xml version="1.0" encoding="UTF-8><noop><oops></ooops>'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml'
    })
    expect(read(url)).rejects.toThrow(new Error('The XML document is not well-formed'))
  })
})

describe('test read() standard feed', (done) => {
  test('read rss feed from Google', async () => {
    const url = 'https://some-news-page.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml'
    })
    const result = await read(url)
    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })
    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })
  })

  test('read atom feed from Google', async () => {
    const url = 'https://some-news-page.tld/atom'
    const xml = readFileSync('test-data/atom-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml'
    })
    const result = await read(url)
    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })
    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })
  })

  test('read atom feed which contains multi links', async () => {
    const url = 'https://some-news-page.tld/atom/multilinks'
    const xml = readFileSync('test-data/atom-multilinks.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml'
    })
    const result = await read(url)
    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })
    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })
  })

  test('read json feed from Micro.blog', async () => {
    const url = 'https://some-news-page.tld/json'
    const json = readFileSync('test-data/json-feed-standard-realworld.json', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, json, {
      'Content-Type': 'application/json'
    })
    const result = await read(url)
    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })
    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })
  })
})

describe('test read() standard feed full content', () => {
  setReaderOptions({ includeFullContent: true })
  const newEntryAttrs = [...entryAttrs, 'content']

  test('read rss feed from Google', async () => {
    const url = 'https://some-news-page.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml'
    })
    const result = await read(url)
    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })
    newEntryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })
  })

  test('read atom feed from Google', async () => {
    const url = 'https://some-news-page.tld/atom'
    const xml = readFileSync('test-data/atom-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml'
    })
    const result = await read(url)
    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })
    newEntryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })
  })

  test('read json feed from Micro.blog', async () => {
    const url = 'https://some-news-page.tld/json'
    const json = readFileSync('test-data/json-feed-standard-realworld.json', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, json, {
      'Content-Type': 'application/json'
    })
    const result = await read(url)
    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })
    newEntryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })
  })
})
