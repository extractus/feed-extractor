# feed-extractor

To read & normalize RSS/ATOM/JSON feed data.

[![npm version](https://badge.fury.io/js/@extractus%2Ffeed-extractor.svg)](https://badge.fury.io/js/@extractus%2Ffeed-extractor)
![CodeQL](https://github.com/extractus/feed-extractor/workflows/CodeQL/badge.svg)
![CI test](https://github.com/extractus/feed-extractor/workflows/ci-test/badge.svg)
[![Coverage Status](https://img.shields.io/coveralls/github/extractus/feed-extractor)](https://coveralls.io/github/extractus/feed-extractor?branch=main)

(This library is derived from [feed-reader](https://www.npmjs.com/package/feed-reader) renamed.)

## Demo

- [Give it a try!](https://extractor-demos.pages.dev/feed-extractor)
- [Example FaaS](https://extractus.deno.dev/extract?apikey=rn0wbHos2e73W6ghQf705bdF&type=feed&url=https://news.google.com/rss)

## Install & Usage

### Node.js

```bash
npm i @extractus/feed-extractor
```

```ts
// es6 module
import { extract } from '@extractus/feed-extractor'

// CommonJS
const { extract } = require('@extractus/feed-extractor')

// you can specify exactly path to CommonJS version
const { extract } = require('@extractus/feed-extractor/dist/cjs/feed-extractor.js')

// extract a RSS
const result = await extract('https://news.google.com/rss')
console.log(result)
```

### Deno

```ts
// deno < 1.28
import { extract } from 'https://esm.sh/@extractus/feed-extractor'

// deno > 1.28
import { extract } from 'npm:@extractus/feed-extractor'
```

### Browser

```ts
import { extract } from 'https://unpkg.com/@extractus/feed-extractor@latest/dist/feed-extractor.esm.js'
```

Please check [the examples](https://github.com/extractus/feed-extractor/tree/main/examples) for reference.


## APIs

- [extract()](#extract)
- [extractFromJson()](#extractfromjson)
- [extractFromXml()](#extractfromxml)

#### Note:

- *Old method `read()` has been marked as deprecated and will be removed in next major release.*

---

### `extract()`

Load and extract feed data from given RSS/ATOM/JSON source. Return a Promise object.

#### Syntax

```ts
extract(String url)
extract(String url, Object parserOptions)
extract(String url, Object parserOptions, Object fetchOptions)
```

Example:

```js
import { extract } from '@extractus/feed-extractor'

const result = await extract('https://news.google.com/atom')
console.log(result)
```

Without any options, the result should have the following structure:

```ts
{
  title: String,
  link: String,
  description: String,
  generator: String,
  language: String,
  published: ISO Date String,
  entries: Array[
    {
      id: String,
      title: String,
      link: String,
      description: String,
      published: ISO Datetime String
    },
    // ...
  ]
}
```

#### Parameters

##### `url` *required*

URL of a valid feed source

Feed content must be accessible and conform one of the following standards:

  - [RSS Feed](https://www.rssboard.org/rss-specification)
  - [ATOM Feed](https://datatracker.ietf.org/doc/html/rfc5023)
  - [JSON Feed](https://www.jsonfeed.org/version/1.1/)

##### `parserOptions` *optional*

Object with all or several of the following properties:

  - `normalization`: Boolean, normalize feed data or keep original. Default `true`.
  - `useISODateFormat`: Boolean, convert datetime to ISO format. Default `true`.
  - `descriptionMaxLen`: Number, to truncate description. Default `210` (characters).
  - `xmlParserOptions`: Object, used by xml parser, view [fast-xml-parser's docs](https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md)
  - `getExtraFeedFields`: Function, to get more fields from feed data
  - `getExtraEntryFields`: Function, to get more fields from feed entry data
  - `baseUrl`: URL string, to absolutify the links within feed content

For example:

```ts
import { extract } from '@extractus/feed-extractor'

await extract('https://news.google.com/atom', {
  useISODateFormat: false
})

await extract('https://news.google.com/rss', {
  useISODateFormat: false,
  getExtraFeedFields: (feedData) => {
    return {
      subtitle: feedData.subtitle || ''
    }
  },
  getExtraEntryFields: (feedEntry) => {
    const {
      enclosure,
      category
    } = feedEntry
    return {
      enclosure: {
        url: enclosure['@_url'],
        type: enclosure['@_type'],
        length: enclosure['@_length']
      },
      category: isString(category) ? category : {
        text: category['@_text'],
        domain: category['@_domain']
      }
    }
  }
})
```

##### `fetchOptions` *optional*

`fetchOptions` is an object that can have the following properties:

- `headers`: to set request headers
- `proxy`: another endpoint to forward the request to
- `agent`: a HTTP proxy agent
- `signal`: AbortController signal or AbortSignal timeout to terminate the request

For example, you can use this param to set request headers to fetch as below:

```js
import { extract } from '@extractus/feed-extractor'

const url = 'https://news.google.com/rss'
await extract(url, null, {
  headers: {
    'user-agent': 'Opera/9.60 (Windows NT 6.0; U; en) Presto/2.1.1'
  }
})
```

You can also specify a proxy endpoint to load remote content, instead of fetching directly.

For example:

```js
import { extract } from '@extractus/feed-extractor'

const url = 'https://news.google.com/rss'

await extract(url, null, {
  headers: {
    'user-agent': 'Opera/9.60 (Windows NT 6.0; U; en) Presto/2.1.1'
  },
  proxy: {
    target: 'https://your-secret-proxy.io/loadXml?url=',
    headers: {
      'Proxy-Authorization': 'Bearer YWxhZGRpbjpvcGVuc2VzYW1l...'
    }
  }
})
```

Passing requests to proxy is useful while running `@extractus/feed-extractor` on browser.
View `examples/browser-feed-reader` as reference example.

Another way to work with proxy is use `agent` option instead of `proxy` as below:

```js
import { extract } from '@extractus/feed-extractor'

import { HttpsProxyAgent } from 'https-proxy-agent'

const proxy = 'http://abc:RaNdoMpasswORd_country-France@proxy.packetstream.io:31113'

const url = 'https://news.google.com/rss'

const feed = await extract(url, null, {
  agent: new HttpsProxyAgent(proxy),
})
console.log('Run feed-extractor with proxy:', proxy)
console.log(feed)
```

For more info about [https-proxy-agent](https://www.npmjs.com/package/https-proxy-agent), check [its repo](https://github.com/TooTallNate/proxy-agents).

By default, there is no request timeout. You can use the option `signal` to cancel request at the right time.

The common way is to use AbortControler:

```js
const controller = new AbortController()

// stop after 5 seconds
setTimeout(() => {
  controller.abort()
}, 5000)

const data = await extract(url, null, {
  signal: controller.signal,
})
```

A newer solution is AbortSignal's `timeout()` static method:

```js
// stop after 5 seconds
const data = await extract(url, null, {
  signal: AbortSignal.timeout(5000),
})
```

For more info:

- [AbortController constructor](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [AbortSignal: timeout() static method](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)


### `extractFromJson()`

Extract feed data from JSON string.
Return an object which contains feed data.

#### Syntax

```ts
extractFromJson(String json)
extractFromJson(String json, Object parserOptions)
```

Example:

```js
import { extractFromJson } from '@extractus/feed-extractor'

const url = 'https://www.jsonfeed.org/feed.json'
// this resource provides data in JSON feed format
// so we fetch remote content as json
// then pass to feed-extractor
const res = await fetch(url)
const json = await res.json()

const feed = extractFromJson(json)
console.log(feed)
```

#### Parameters

##### `json` *required*

JSON string loaded from JSON feed resource.

##### `parserOptions` *optional*

See [parserOptions](#parseroptions-optional) above.


### `extractFromXml()`

Extract feed data from XML string.
Return an object which contains feed data.

#### Syntax

```ts
extractFromXml(String xml)
extractFromXml(String xml, Object parserOptions)
```

Example:

```js
import { extractFromXml } from '@extractus/feed-extractor'

const url = 'https://news.google.com/atom'
// this resource provides data in ATOM feed format
// so we fetch remote content as text
// then pass to feed-extractor
const res = await fetch(url)
const xml = await res.text()

const feed = extractFromXml(xml)
console.log(feed)
```

#### Parameters

##### `xml` *required*

XML string loaded from RSS/ATOM feed resource.

##### `parserOptions` *optional*

See [parserOptions](#parseroptions-optional) above.


## Test

```bash
git clone https://github.com/extractus/feed-extractor.git
cd feed-extractor
npm i
npm test
```

![feed-extractor-test.png](https://i.imgur.com/2b5xt6S.png)


## Quick evaluation

```bash
git clone https://github.com/extractus/feed-extractor.git
cd feed-extractor
npm install

npm run eval https://news.google.com/rss
```

## License
The MIT License (MIT)

---
