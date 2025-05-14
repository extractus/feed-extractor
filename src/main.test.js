// main.test
/* eslint-env jest */

import { readFileSync } from 'node:fs'

import nock from 'nock'
import { HttpsProxyAgent } from 'https-proxy-agent'

import { hasProperty, isString } from '@ndaidong/bellajs'

import { extract, extractFromXml, extractFromJson, read } from './main.js'
import { isValid as isValidUrl } from './utils/linker.js'

const env = process.env || {}
const PROXY_SERVER = env.PROXY_SERVER || ''

const feedAttrs = 'title link description generator language published entries'.split(' ')
const entryAttrs = 'title link description published id'.split(' ')

const parseUrl = (url) => {
  const re = new URL(url)
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.pathname,
  }
}

const isValidDate = (d) => {
  return (new Date(d)).toString() !== 'Invalid Date'
}

const validateProps = (entry) => {
  const { id, link, title, published, description } = entry
  return isString(description) &&
    isString(id) && id !== '' &&
    isString(title) && title !== '' &&
    isString(link) && isValidUrl(link) &&
    isString(published) && isValidDate(published)
}

describe('test extract() function with common issues', () => {
  test('extract feed from a non-string link', () => {
    expect(extract([])).rejects.toThrow(new Error('Input param must be a valid URL'))
  })

  test('extract feed from a 404 link', () => {
    const url = 'https://somewhere.xyz/alpha/beta'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(404)
    expect(extract(url)).rejects.toThrow(new Error('Request failed with error code 404'))
  })

  test('extract feed from empty xml', () => {
    const url = 'https://empty-source.elsewhere/rss'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, '', {
      'Content-Type': 'application/xml',
    })
    expect(extract(url)).rejects.toThrow(new Error(`Failed to load content from "${url}"`))
  })

  test('extract feed from invalid xml', async () => {
    const url = 'https://averybad-source.elsewhere/rss'
    const xml = '<?xml version="1.0" encoding="UTF-8><noop><oops></ooops>'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    expect(extract(url)).rejects.toThrow(new Error('The XML document is not well-formed'))
  })

  test('extract feed from invalid json', async () => {
    const url = 'https://averybad-source.elsewhere/jsonfeed'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, 'this is not json string', {
      'Content-Type': 'application/json',
    })
    expect(extract(url)).rejects.toThrow(new Error('Failed to convert data to JSON object'))
  })
})

describe('test extract() standard feed', () => {
  test('extract rss feed from Google', async () => {
    const url = 'https://some-news-page.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url)
    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })
    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })
    expect(validateProps(result.entries[0])).toBe(true)
  })

  test('extract atom feed from Google', async () => {
    const url = 'https://some-news-page.tld/atom'
    const xml = readFileSync('test-data/atom-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url)
    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })
    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })
    expect(validateProps(result.entries[0])).toBe(true)
  })

  test('extract atom feed from Google with extraFields', async () => {
    const url = 'https://some-news-page.tld/atom'
    const xml = readFileSync('test-data/atom-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      getExtraFeedFields: data => {
        return {
          author: data.author,
        }
      },
      getExtraEntryFields: data => {
        return {
          id: data.id,
        }
      },
    })
    expect(hasProperty(result, 'author')).toBe(true)
    expect(hasProperty(result.entries[0], 'id')).toBe(true)
    expect(validateProps(result.entries[0])).toBe(true)
  })

  test('extract rdf feed from Slashdot with extraFields', async () => {
    const url = 'https://some-news-page.tld/atom'
    const xml = readFileSync('test-data/rdf-standard.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      getExtraFeedFields: data => {
        return {
          subject: data['dc:subject'],
        }
      },
      getExtraEntryFields: data => {
        return {
          author: data['dc:creator'],
        }
      },
    })
    expect(hasProperty(result, 'subject')).toBe(true)
    expect(hasProperty(result.entries[0], 'author')).toBe(true)
    expect(validateProps(result.entries[0])).toBe(true)
  })

  test('extract atom feed which contains multi links', async () => {
    const url = 'https://some-news-page.tld/atom/multilinks'
    const xml = readFileSync('test-data/atom-multilinks.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url)
    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })
    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })
    expect(validateProps(result.entries[0])).toBe(true)
  })

  test('extract json feed from Micro.blog', async () => {
    const url = 'https://some-news-page.tld/json'
    const json = readFileSync('test-data/json-feed-standard-realworld.json', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, json, {
      'Content-Type': 'text/json',
    })
    const result = await extract(url)
    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })
    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })
    expect(validateProps(result.entries[0])).toBe(true)
  })

  test('extract json feed from Micro.blog with extra fields', async () => {
    const url = 'https://some-news-page.tld/json'
    const json = readFileSync('test-data/json-feed-standard-realworld.json', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, json, {
      'Content-Type': 'text/json',
    })
    const result = await extract(url, {
      getExtraFeedFields: data => {
        return {
          icon: data.icon,
        }
      },
      getExtraEntryFields: data => {
        return {
          id: data.id,
        }
      },
    })
    expect(hasProperty(result, 'icon')).toBe(true)
    expect(hasProperty(result.entries[0], 'id')).toBe(true)
    expect(validateProps(result.entries[0])).toBe(true)
  })

  test('extract rss feed from huggingface.co (no link)', async () => {
    const url = 'https://huggingface.co/no-link/rss'
    const xml = readFileSync('test-data/rss-feed-miss-link.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url)
    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })
    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })
    expect(validateProps(result.entries[0])).toBe(true)
  })

  test('extract rss feed from medium.com (content:encoded)', async () => {
    const url = 'https://medium.com/feed/@ameliakusiak'
    const xml = readFileSync('test-data/medium-feed.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url)
    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })
    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })
    expect(validateProps(result.entries[0])).toBe(true)
  })
})

describe('test extract() with `useISODateFormat` option', () => {
  test('set `useISODateFormat` to false', async () => {
    const url = 'https://realworld-standard-feed.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      useISODateFormat: false,
    })
    expect(result.published).toEqual('Thu, 28 Jul 2022 03:39:57 GMT')
    expect(result.entries[0].published).toEqual('Thu, 28 Jul 2022 02:43:00 GMT')
  })

  test('set `useISODateFormat` to true', async () => {
    const url = 'https://realworld-standard-feed.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      useISODateFormat: true,
    })
    expect(result.published).toEqual('2022-07-28T03:39:57.000Z')
    expect(result.entries[0].published).toEqual('2022-07-28T02:43:00.000Z')
  })
})

describe('test extract() without normalization', () => {
  test('extract rss feed from Google', async () => {
    const url = 'https://some-news-page.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      normalization: false,
    })
    expect(hasProperty(result, 'webMaster')).toBe(true)
    expect(hasProperty(result, 'item')).toBe(true)
    expect(hasProperty(result.item[0], 'source')).toBe(true)
  })
  test('extract rss feed from standard example', async () => {
    const url = 'https://some-news-page.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      normalization: false,
    })
    expect(hasProperty(result, 'copyright')).toBe(true)
    expect(hasProperty(result, 'item')).toBe(true)
    expect(hasProperty(result.item, 'guid')).toBe(true)
  })

  test('extract rdf feed from Slashdot without normalization', async () => {
    const url = 'https://some-news-page.tld/atom'
    const xml = readFileSync('test-data/rdf-standard.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      normalization: false,
    })
    expect(hasProperty(result.channel, 'syn:updateBase')).toBe(true)
    expect(hasProperty(result.channel, 'dc:rights')).toBe(true)
    expect(hasProperty(result, 'item')).toBe(true)
    expect(hasProperty(result.item[0], 'slash:department')).toBe(true)
  })

  test('extract atom feed from Google', async () => {
    const url = 'https://some-news-page.tld/atom'
    const xml = readFileSync('test-data/atom-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      normalization: false,
    })
    expect(hasProperty(result, 'id')).toBe(true)
    expect(hasProperty(result, 'rights')).toBe(true)
    expect(hasProperty(result, 'entry')).toBe(true)
    expect(hasProperty(result.entry[0], 'updated')).toBe(true)
  })

  test('extract atom feed from standard example', async () => {
    const url = 'https://some-news-page.tld/atom'
    const xml = readFileSync('test-data/atom-feed-standard.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      normalization: false,
    })
    expect(hasProperty(result, 'id')).toBe(true)
    expect(hasProperty(result, 'entry')).toBe(true)
    expect(hasProperty(result.entry, 'published')).toBe(true)
    expect(hasProperty(result.entry, 'updated')).toBe(true)
    expect(hasProperty(result.entry, 'summary')).toBe(true)
    expect(hasProperty(result.entry, 'content')).toBe(true)
  })

  test('extract json feed from Micro.blog', async () => {
    const url = 'https://some-news-page.tld/json'
    const json = readFileSync('test-data/json-feed-standard-realworld.json', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, json, {
      'Content-Type': 'application/json',
    })
    const result = await extract(url, {
      normalization: false,
    })
    expect(hasProperty(result, 'icon')).toBe(true)
    expect(hasProperty(result, 'favicon')).toBe(true)
    expect(hasProperty(result, 'items')).toBe(true)
    expect(hasProperty(result.items[0], 'tags')).toBe(true)
    expect(hasProperty(result.items[0], 'date_published')).toBe(true)
  })

  test('extract rss podcast feed with enclosure tag', async () => {
    const url = 'https://some-podcast-page.tld/podcast/rss'
    const xml = readFileSync('test-data/podcast.rss', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      normalization: false,
    })
    expect(hasProperty(result, 'itunes:owner')).toBe(true)
    expect(hasProperty(result.item[0], 'itunes:duration')).toBe(true)
  })
})

describe('test extract with `baseUrl` option', () => {
  test('extract rss feed from file', () => {
    const baseUrl = 'https://huggingface.co'
    const xml = readFileSync('test-data/rss-feed-miss-base-url.xml', 'utf8')
    const result = extractFromXml(xml, { baseUrl })

    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })

    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })

    expect(validateProps(result.entries[0])).toBe(true)
    expect(result.link).toBe(baseUrl + '/blog')
    expect(result.entries[0].link).toBe(baseUrl + '/blog/intro-graphml')
  })

  test('extract rdf feed from file', () => {
    const baseUrl = 'https://slashdot.org'
    const xml = readFileSync('test-data/rdf-standard.xml', 'utf8')
    const result = extractFromXml(xml, { baseUrl })

    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })

    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })

    expect(validateProps(result.entries[0])).toBe(true)
    expect(result.link).toBe(baseUrl + '/')
    const firstItemLink = result.entries[0].link
    expect(firstItemLink.startsWith('https://tech.slashdot.org/story/23/08/23/2238246/spacex-')).toBe(true)
  })

  test('extract json feed from file', () => {
    const baseUrl = 'https://www.jsonfeed.org'
    const json = readFileSync('test-data/json-feed-miss-base-url.json', 'utf8')
    const result = extractFromJson(JSON.parse(json), { baseUrl })

    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })

    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })

    expect(result.link).toBe(baseUrl + '/')
    expect(result.entries[0].link).toBe(baseUrl + '/2020/08/07/json-feed-version.html')
  })

  test('extract rss feed with url', async () => {
    const url = 'https://huggingface.co/blog/rss'
    const xml = readFileSync('test-data/rss-feed-miss-base-url.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, { baseUrl })

    feedAttrs.forEach((k) => {
      expect(hasProperty(result, k)).toBe(true)
    })

    entryAttrs.forEach((k) => {
      expect(hasProperty(result.entries[0], k)).toBe(true)
    })

    expect(validateProps(result.entries[0])).toBe(true)
    expect(result.link).toBe(baseUrl + '/blog')
    expect(result.entries[0].link).toBe(baseUrl + '/blog/intro-graphml')
  })
})

if (PROXY_SERVER !== '') {
  describe('test extract live RSS via proxy server', () => {
    test('check if extract method works with proxy server', async () => {
      const url = 'https://news.google.com/rss'
      const result = await extract(url, {}, {
        agent: new HttpsProxyAgent(PROXY_SERVER),
      })
      expect(result.title).toContain('Google News')
      expect(result.entries.length).toBeGreaterThan(0)
    }, 10000)
  })
}

describe('check old method read()', () => {
  test('ensure that depricated method read() still works', async () => {
    const url = 'https://realworld-standard-feed.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await read(url, {
      useISODateFormat: true,
    })
    expect(result.published).toEqual('2022-07-28T03:39:57.000Z')
    expect(result.entries[0].published).toEqual('2022-07-28T02:43:00.000Z')
  })
})
