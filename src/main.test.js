// main.test
/* eslint-env jest */

const { readFileSync } = require('fs')

const { hasProperty } = require('bellajs')
const nock = require('nock')

const { parse } = require('./main')

const feedAttrs = 'title link description generator language updated entries'.split(' ')
const entryAttrs = 'title link description pubDate'.split(' ')

const state = {}

const parseUrl = (url) => {
  const re = new URL(url)
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.pathname
  }
}

test('test parse a non-string link', async () => {
  const url = []
  const fn = async () => {
    const re = await parse(url)
    return re
  }
  expect(fn()).rejects.toThrow(Error)
})

test('test parse a fake link', async () => {
  const url = 'https://somewhere.xyz/alpha/beta'
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(404)
  nock(baseUrl).get(path).reply(404)
  const fn = async () => {
    const re = await parse(url)
    return re
  }
  expect(fn()).rejects.toThrow(Error)
})

test('test parse from good atom source', async () => {
  const url = 'https://news.google.com/atom'
  const xml = readFileSync('test-data/atom.xml', 'utf8')
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(200)
  nock(baseUrl).get(path).reply(200, xml, {
    'Content-Type': 'application/xml'
  })
  const result = await parse(url)
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

test('test parse from good rss source', async () => {
  const url = 'https://news.google.com/rss'
  const xml = readFileSync('test-data/rss.xml', 'utf8')
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(200)
  nock(baseUrl).get(path).reply(200, xml, {
    'Content-Type': 'application/xml'
  })
  const result = await parse(url)
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

test('test parse from a more complicate atom source', async () => {
  const url = 'https://headline.com/atom'
  const xml = readFileSync('test-data/another-atom.xml', 'utf8')
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(200)
  nock(baseUrl).get(path).reply(200, xml, {
    'Content-Type': 'application/xml'
  })
  const result = await parse(url)
  expect(result).toBeInstanceOf(Object)
  feedAttrs.forEach((k) => {
    expect(hasProperty(result, k)).toBe(true)
  })
  entryAttrs.forEach((k) => {
    expect(hasProperty(result.entries[0], k)).toBe(true)
  })
})
