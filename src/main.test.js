// main.test
/* eslint-env jest */

import { readFileSync } from 'fs'

import { hasProperty } from 'bellajs'
import nock from 'nock'

import { read } from './main.js'

const feedAttrs = 'title link description generator language published entries'.split(' ')
const entryAttrs = 'title link description published'.split(' ')

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

const runtest = ({ type, url, file, size }) => {
  describe(`test if ${type} parsing works correctly`, () => {
    const state = {}
    test(`test read from good ${type} source`, async () => {
      const xml = readFileSync(file, 'utf8')
      const { baseUrl, path } = parseUrl(url)
      nock(baseUrl).head(path).reply(200)
      nock(baseUrl).get(path).reply(200, xml, {
        'Content-Type': 'application/xml'
      })
      const result = await read(url)
      expect(result).toBeInstanceOf(Object)
      expect(result.entries.length).toEqual(size)
      state.data = result
      state.firstEntry = result.entries[0]
    })

    feedAttrs.forEach((k) => {
      test(`  test if ${type} feed has property "${k}"`, () => {
        expect(hasProperty(state.data, k)).toBe(true)
      })
    })
    entryAttrs.forEach((k) => {
      test(`  test if ${type} feed entry has property "${k}"`, () => {
        expect(hasProperty(state.firstEntry, k)).toBe(true)
      })
    })
  })
}

const sources = [
  {
    type: 'atom',
    url: 'https://news.google.com/atom',
    file: 'test-data/atom.xml',
    size: 2
  },
  {
    type: 'atom',
    url: 'https://news.google.com/atom-with-single-item',
    file: 'test-data/atom-with-single-item.xml',
    size: 1
  },
  {
    type: 'rss',
    url: 'https://news.google.com/rss',
    file: 'test-data/rss.xml',
    size: 2
  },
  {
    type: 'rss',
    url: 'https://news.google.com/rss-with-single-item',
    file: 'test-data/rss-with-single-item.xml',
    size: 1
  }
]

sources.forEach(runtest)

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
