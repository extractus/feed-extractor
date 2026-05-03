// main.test

import { describe, it } from 'node:test'
import assert from 'node:assert'
import { readFileSync } from 'node:fs'

import nock from 'nock'
import { HttpsProxyAgent } from 'https-proxy-agent'

import { hasProperty, isString } from '@pwshub/bellajs'

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
  it('extract feed from a non-string link', async () => {
    try {
      await extract([])
    } catch (err) {
      assert.equal(err.message, 'Input param must be a valid URL')
    }
  })

  it('extract feed from a 404 link', async () => {
    const url = 'https://somewhere.xyz/alpha/beta'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(404)
    try {
      await extract(url)
    } catch (err) {
      assert.equal(err.message, 'Request failed with error code 404')
    }
  })

  it('extract feed from empty xml', async () => {
    const url = 'https://empty-source.elsewhere/rss'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, '', {
      'Content-Type': 'application/xml',
    })
    try {
      await extract(url)
    } catch (err) {
      assert.equal(err.message, `Failed to load content from "${url}"`)
    }
  })

  it('extract feed from invalid xml', async () => {
    const url = 'https://averybad-source.elsewhere/rss'
    const xml = '<?xml version="1.0" encoding="UTF-8><noop><oops></ooops>'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    try {
      await extract(url)
    } catch (err) {
      assert.equal(err.message, 'The XML document is not well-formed')
    }
  })

  it('extract feed from invalid json', async () => {
    const url = 'https://averybad-source.elsewhere/jsonfeed'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, 'this is not json string', {
      'Content-Type': 'application/json',
    })
    try {
      await extract(url)
    } catch (err) {
      assert.equal(err.message, 'Failed to convert data to JSON object')
    }
  })
})

describe('test extract() standard feed', () => {
  it('extract rss feed from Google', async () => {
    const url = 'https://some-news-page.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url)
    feedAttrs.forEach((k) => {
      assert.ok(hasProperty(result, k))
    })
    entryAttrs.forEach((k) => {
      assert.ok(hasProperty(result.entries[0], k))
    })
    assert.ok(validateProps(result.entries[0]))
  })

  it('extract atom feed from Google', async () => {
    const url = 'https://some-news-page.tld/atom'
    const xml = readFileSync('test-data/atom-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url)
    feedAttrs.forEach((k) => {
      assert.ok(hasProperty(result, k))
    })
    entryAttrs.forEach((k) => {
      assert.ok(hasProperty(result.entries[0], k))
    })
    assert.ok(validateProps(result.entries[0]))
  })

  it('extract atom feed from Google with extraFields', async () => {
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
    assert.ok(hasProperty(result, 'author'))
    assert.ok(hasProperty(result.entries[0], 'id'))
    assert.ok(validateProps(result.entries[0]))
  })

  it('extract rdf feed from Slashdot with extraFields', async () => {
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
    assert.ok(hasProperty(result, 'subject'))
    assert.ok(hasProperty(result.entries[0], 'author'))
    assert.ok(validateProps(result.entries[0]))
  })

  it('extract atom feed which contains multi links', async () => {
    const url = 'https://some-news-page.tld/atom/multilinks'
    const xml = readFileSync('test-data/atom-multilinks.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url)
    feedAttrs.forEach((k) => {
      assert.ok(hasProperty(result, k))
    })
    entryAttrs.forEach((k) => {
      assert.ok(hasProperty(result.entries[0], k))
    })
    assert.ok(validateProps(result.entries[0]))
  })

  it('extract json feed from Micro.blog', async () => {
    const url = 'https://some-news-page.tld/json'
    const json = readFileSync('test-data/json-feed-standard-realworld.json', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, json, {
      'Content-Type': 'text/json',
    })
    const result = await extract(url)
    feedAttrs.forEach((k) => {
      assert.ok(hasProperty(result, k))
    })
    entryAttrs.forEach((k) => {
      assert.ok(hasProperty(result.entries[0], k))
    })
    assert.ok(validateProps(result.entries[0]))
  })

  it('extract json feed from Micro.blog with extra fields', async () => {
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
    assert.ok(hasProperty(result, 'icon'))
    assert.ok(hasProperty(result.entries[0], 'id'))
    assert.ok(validateProps(result.entries[0]))
  })

  it('extract rss feed from huggingface.co (no link)', async () => {
    const url = 'https://huggingface.co/no-link/rss'
    const xml = readFileSync('test-data/rss-feed-miss-link.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url)
    feedAttrs.forEach((k) => {
      assert.ok(hasProperty(result, k))
    })
    entryAttrs.forEach((k) => {
      assert.ok(hasProperty(result.entries[0], k))
    })
    assert.ok(validateProps(result.entries[0]))
  })

  it('extract rss feed from medium.com (content:encoded)', async () => {
    const url = 'https://medium.com/feed/@ameliakusiak'
    const xml = readFileSync('test-data/medium-feed.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url)
    feedAttrs.forEach((k) => {
      assert.ok(hasProperty(result, k))
    })
    entryAttrs.forEach((k) => {
      assert.ok(hasProperty(result.entries[0], k))
    })
    assert.ok(validateProps(result.entries[0]))
  })
})

describe('test extract() with `useISODateFormat` option', () => {
  it('set `useISODateFormat` to false', async () => {
    const url = 'https://realworld-standard-feed.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      useISODateFormat: false,
    })
    assert.equal(result.published, 'Thu, 28 Jul 2022 03:39:57 GMT')
    assert.equal(result.entries[0].published, 'Thu, 28 Jul 2022 02:43:00 GMT')
  })

  it('set `useISODateFormat` to true', async () => {
    const url = 'https://realworld-standard-feed.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      useISODateFormat: true,
    })
    assert.equal(result.published, '2022-07-28T03:39:57.000Z')
    assert.equal(result.entries[0].published, '2022-07-28T02:43:00.000Z')
  })
})

describe('test extract() without normalization', () => {
  it('extract rss feed from Google', async () => {
    const url = 'https://some-news-page.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      normalization: false,
    })
    assert.ok(hasProperty(result, 'webMaster'))
    assert.ok(hasProperty(result, 'item'))
    assert.ok(hasProperty(result.item[0], 'source'))
  })
  it('extract rss feed from standard example', async () => {
    const url = 'https://some-news-page.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      normalization: false,
    })
    assert.ok(hasProperty(result, 'copyright'))
    assert.ok(hasProperty(result, 'item'))
    assert.ok(hasProperty(result.item, 'guid'))
  })

  it('extract rdf feed from Slashdot without normalization', async () => {
    const url = 'https://some-news-page.tld/atom'
    const xml = readFileSync('test-data/rdf-standard.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      normalization: false,
    })
    assert.ok(hasProperty(result.channel, 'syn:updateBase'))
    assert.ok(hasProperty(result.channel, 'dc:rights'))
    assert.ok(hasProperty(result, 'item'))
    assert.ok(hasProperty(result.item[0], 'slash:department'))
  })

  it('extract atom feed from Google', async () => {
    const url = 'https://some-news-page.tld/atom'
    const xml = readFileSync('test-data/atom-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      normalization: false,
    })
    assert.ok(hasProperty(result, 'id'))
    assert.ok(hasProperty(result, 'rights'))
    assert.ok(hasProperty(result, 'entry'))
    assert.ok(hasProperty(result.entry[0], 'updated'))
  })

  it('extract atom feed from standard example', async () => {
    const url = 'https://some-news-page.tld/atom'
    const xml = readFileSync('test-data/atom-feed-standard.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      normalization: false,
    })
    assert.ok(hasProperty(result, 'id'))
    assert.ok(hasProperty(result, 'entry'))
    assert.ok(hasProperty(result.entry, 'published'))
    assert.ok(hasProperty(result.entry, 'updated'))
    assert.ok(hasProperty(result.entry, 'summary'))
    assert.ok(hasProperty(result.entry, 'content'))
  })

  it('extract json feed from Micro.blog', async () => {
    const url = 'https://some-news-page.tld/json'
    const json = readFileSync('test-data/json-feed-standard-realworld.json', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, json, {
      'Content-Type': 'application/json',
    })
    const result = await extract(url, {
      normalization: false,
    })
    assert.ok(hasProperty(result, 'icon'))
    assert.ok(hasProperty(result, 'favicon'))
    assert.ok(hasProperty(result, 'items'))
    assert.ok(hasProperty(result.items[0], 'tags'))
    assert.ok(hasProperty(result.items[0], 'date_published'))
  })

  it('extract rss podcast feed with enclosure tag', async () => {
    const url = 'https://some-podcast-page.tld/podcast/rss'
    const xml = readFileSync('test-data/podcast.rss', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, {
      normalization: false,
    })
    assert.ok(hasProperty(result, 'itunes:owner'))
    assert.ok(hasProperty(result.item[0], 'itunes:duration'))
  })
})

describe('test extract with `baseUrl` option', () => {
  it('extract rss feed from file', () => {
    const baseUrl = 'https://huggingface.co'
    const xml = readFileSync('test-data/rss-feed-miss-base-url.xml', 'utf8')
    const result = extractFromXml(xml, { baseUrl })

    feedAttrs.forEach((k) => {
      assert.ok(hasProperty(result, k))
    })

    entryAttrs.forEach((k) => {
      assert.ok(hasProperty(result.entries[0], k))
    })

    assert.ok(validateProps(result.entries[0]))
    assert.equal(result.link, baseUrl + '/blog')
    assert.equal(result.entries[0].link, baseUrl + '/blog/intro-graphml')
  })

  it('extract rdf feed from file', () => {
    const baseUrl = 'https://slashdot.org'
    const xml = readFileSync('test-data/rdf-standard.xml', 'utf8')
    const result = extractFromXml(xml, { baseUrl })

    feedAttrs.forEach((k) => {
      assert.ok(hasProperty(result, k))
    })

    entryAttrs.forEach((k) => {
      assert.ok(hasProperty(result.entries[0], k))
    })

    assert.ok(validateProps(result.entries[0]))
    assert.equal(result.link, baseUrl + '/')
    const firstItemLink = result.entries[0].link
    assert.ok(firstItemLink.startsWith('https://tech.slashdot.org/story/23/08/23/2238246/spacex-'))
  })

  it('extract json feed from file', () => {
    const baseUrl = 'https://www.jsonfeed.org'
    const json = readFileSync('test-data/json-feed-miss-base-url.json', 'utf8')
    const result = extractFromJson(JSON.parse(json), { baseUrl })

    feedAttrs.forEach((k) => {
      assert.ok(hasProperty(result, k))
    })

    entryAttrs.forEach((k) => {
      assert.ok(hasProperty(result.entries[0], k))
    })

    assert.equal(result.link, baseUrl + '/')
    assert.equal(result.entries[0].link, baseUrl + '/2020/08/07/json-feed-version.html')
  })

  it('extract rss feed with url', async () => {
    const url = 'https://huggingface.co/blog/rss'
    const xml = readFileSync('test-data/rss-feed-miss-base-url.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await extract(url, { baseUrl })

    feedAttrs.forEach((k) => {
      assert.ok(hasProperty(result, k))
    })

    entryAttrs.forEach((k) => {
      assert.ok(hasProperty(result.entries[0], k))
    })

    assert.ok(validateProps(result.entries[0]))
    assert.equal(result.link, baseUrl + '/blog')
    assert.equal(result.entries[0].link, baseUrl + '/blog/intro-graphml')
  })
})

if (PROXY_SERVER !== '') {
  describe('test extract live RSS via proxy server', () => {
    it('check if extract method works with proxy server', async () => {
      const url = 'https://news.google.com/rss'
      const result = await extract(url, {}, {
        agent: new HttpsProxyAgent(PROXY_SERVER),
      })
      assert.ok(result.title.includes('Google News'))
      assert.ok(result.entries.length > 0)
    }, 10000)
  })
}

describe('check old method read()', () => {
  it('ensure that depricated method read() still works', async () => {
    const url = 'https://realworld-standard-feed.tld/rss'
    const xml = readFileSync('test-data/rss-feed-standard-realworld.xml', 'utf8')
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, xml, {
      'Content-Type': 'application/xml',
    })
    const result = await read(url, {
      useISODateFormat: true,
    })
    assert.equal(result.published, '2022-07-28T03:39:57.000Z')
    assert.equal(result.entries[0].published, '2022-07-28T02:43:00.000Z')
  })
})
