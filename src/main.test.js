// main.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import { hasProperty } from 'bellajs'
import nock from 'nock'

import { read } from './main.js'

const feedAttrs = 'title link description generator language published entries'.split(' ')
const entryAttrs = 'title link description published'.split(' ')

const state = {}

const parseUrl = (url) => {
  const re = new URL(url)
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.pathname
  }
}

test('test read a non-string link', async () => {
  const url = []
  const fn = async () => {
    const re = await read(url)
    return re
  }
  expect(fn()).rejects.toThrow(Error)
})

test('test read a fake link', async () => {
  const url = 'https://somewhere.xyz/alpha/beta'
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(404)
  nock(baseUrl).get(path).reply(404)
  const fn = async () => {
    const re = await read(url)
    return re
  }
  expect(fn()).rejects.toThrow(Error)
})

test('test read from invalid xml', async () => {
  const url = 'https://averybad-source.elsewhere/rss'
  const xml = '<?xml version="1.0" encoding="UTF-8"><rss><oops></ooops>'
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(200)
  nock(baseUrl).get(path).reply(200, xml, {
    'Content-Type': 'application/xml'
  })
  const fn = async () => {
    const re = await read(url)
    return re
  }
  expect(fn()).rejects.toThrow(Error)
})

test('test read from good atom source', async () => {
  const url = 'https://news.google.com/atom'
  const xml = readFileSync('test-data/atom.xml', 'utf8')
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(200)
  nock(baseUrl).get(path).reply(200, xml, {
    'Content-Type': 'application/xml'
  })
  const result = await read(url)
  expect(result).toBeInstanceOf(Object)
  expect(result.entries.length).toEqual(2)
  state.atomFeed = result
  state.atomFeedEntry = result.entries[0]
})

feedAttrs.forEach((k) => {
  test(`  test if atom feed has property "${k}"`, () => {
    expect(hasProperty(state.atomFeed, k)).toBe(true)
  })
})
entryAttrs.forEach((k) => {
  test(`  test if atom feed entry has property "${k}"`, () => {
    expect(hasProperty(state.atomFeedEntry, k)).toBe(true)
  })
})

test('test read from good rss source', async () => {
  const url = 'https://news.google.com/rss'
  const xml = readFileSync('test-data/rss.xml', 'utf8')
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(200)
  nock(baseUrl).get(path).reply(200, xml, {
    'Content-Type': 'application/xml'
  })
  const result = await read(url)
  expect(result).toBeInstanceOf(Object)
  expect(result.entries.length).toEqual(2)
  state.rssFeed = result
  state.rssFeedEntry = result.entries[0]
})

feedAttrs.forEach((k) => {
  test(`  test if rss feed has property "${k}"`, () => {
    expect(hasProperty(state.rssFeed, k)).toBe(true)
  })
})
entryAttrs.forEach((k) => {
  test(`  test if rss feed entry has property "${k}"`, () => {
    expect(hasProperty(state.rssFeedEntry, k)).toBe(true)
  })
})

test('test read from a more complicate atom source', async () => {
  const url = 'https://headline.com/atom'
  const xml = readFileSync('test-data/another-atom.xml', 'utf8')
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(200)
  nock(baseUrl).get(path).reply(200, xml, {
    'Content-Type': 'application/xml'
  })
  const result = await read(url)
  expect(result).toBeInstanceOf(Object)
  feedAttrs.forEach((k) => {
    expect(hasProperty(result, k)).toBe(true)
  })
  entryAttrs.forEach((k) => {
    expect(hasProperty(result.entries[0], k)).toBe(true)
  })
})
