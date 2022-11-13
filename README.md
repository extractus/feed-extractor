# feed-reader

To read & normalize RSS/ATOM/JSON feed data.

[![NPM](https://badge.fury.io/js/feed-reader.svg)](https://badge.fury.io/js/feed-reader)
![CI test](https://github.com/ndaidong/feed-reader/workflows/ci-test/badge.svg)
[![Coverage Status](https://img.shields.io/coveralls/github/ndaidong/feed-reader)](https://coveralls.io/github/ndaidong/feed-reader?branch=main)
![CodeQL](https://github.com/ndaidong/feed-reader/workflows/CodeQL/badge.svg)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Intro

*oembed-parser* is a part of tool sets for content builder:

- [feed-reader](https://github.com/ndaidong/feed-reader): extract & normalize RSS/ATOM/JSON feed
- [article-parser](https://github.com/ndaidong/article-parser): extract main article from given URL
- [oembed-parser](https://github.com/ndaidong/oembed-parser): extract oEmbed data from supported providers

You can use one or combination of these tools to build news sites, create automated content systems for marketing campaign or gather dataset for NLP projects...

```
                                    ┌────────────────┐
                            ┌───────► article-parser ├──────────┐
                            │       └────────────────┘          │
┌─────────────┐   ┌─────────┴────┐                     ┌────────▼─────────┐   ┌─────────────┐
│ feed-reader ├───► feed entries │                     │ content database ├───► public APIs │
└─────────────┘   └─────────┬────┘                     └────────▲─────────┘   └─────────────┘
                            │       ┌────────────────┐          │
                            └───────► oembed-parser  ├──────────┘
                                    └────────────────┘
```

## Demo

- [Give it a try!](https://demos.pwshub.com/feed-reader)
- [Example FaaS](https://readfeed.deta.dev/?url=https://news.google.com/rss)

## Install & Usage

### Node.js

```bash
npm i feed-reader

# pnpm
pnpm i feed-reader

# yarn
yarn add feed-reader
```

```ts
// es6 module
import { read } from 'feed-reader'

// CommonJS
const { read } = require('feed-reader')

// or specify exactly path to CommonJS variant
const { read } = require('feed-reader/dist/cjs/feed-reader.js')
```

### Deno

```ts
import { read } from 'https://esm.sh/feed-reader'
```

### Browser

```ts
import { read } from 'https://unpkg.com/feed-reader@latest/dist/feed-reader.esm.js'
```

Please check [the examples](https://github.com/ndaidong/feed-reader/tree/main/examples) for reference.

### Deta cloud

For [Deta](https://www.deta.sh/) devs please refer [the source code and guideline here](https://github.com/ndaidong/feed-reader-deta) or simply click the button below.

[![Deploy](https://button.deta.dev/1/svg)](https://go.deta.dev/deploy?repo=https://github.com/ndaidong/feed-reader-deta)


## APIs

### `read()`

Load and extract feed data from given RSS/ATOM/JSON source. Return a Promise object.

#### Syntax

```ts
read(String url)
read(String url, Object options)
read(String url, Object options, Object fetchOptions)
```

#### Parameters

##### `url` *required*

URL of a valid feed source

Feed content must be accessible and conform one of the following standards:

  - [RSS Feed](https://www.rssboard.org/rss-specification)
  - [ATOM Feed](https://datatracker.ietf.org/doc/html/rfc5023)
  - [JSON Feed](https://www.jsonfeed.org/version/1.1/)

For example:

```js
import { read } from 'feed-reader'

read('https://news.google.com/atom').then(result => console.log(result))
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
      title: String,
      link: String,
      description: String,
      published: ISO Datetime String
    },
    // ...
  ]
}
```

##### `options` *optional*

Object with all or several of the following properties:

  - `normalization`: Boolean, normalize feed data or keep original. Default `true`.
  - `useISODateFormat`: Boolean, convert datetime to ISO format. Default `true`.
  - `descriptionMaxLen`: Number, to truncate description. Default `210` (characters).
  - `xmlParserOptions`: Object, used by xml parser, view [fast-xml-parser's docs](https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md)
  - `getExtraFeedFields`: Function, to get more fields from feed data
  - `getExtraEntryFields`: Function, to get more fields from feed entry data

For example:

```ts
import { read } from 'feed-reader'

read('https://news.google.com/atom', {
  useISODateFormat: false
})

read('https://news.google.com/rss', {
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

You can use this param to set request headers to fetch.

For example:

```js
import { read } from 'feed-reader'

const url = 'https://news.google.com/rss'
read(url, null, {
  headers: {
    'user-agent': 'Opera/9.60 (Windows NT 6.0; U; en) Presto/2.1.1'
  }
})
```

You can also specify a proxy endpoint to load remote content, instead of fetching directly.

For example:

```js
import { read } from 'feed-reader'

const url = 'https://news.google.com/rss'

read(url, null, {
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

Passing requests to proxy is useful while running `feed-reader` on browser. View `examples/browser-feed-reader` as reference example.


## Quick evaluation

```bash
git clone https://github.com/ndaidong/feed-reader.git
cd feed-reader
npm install

node eval.js --url=https://news.google.com/rss --normalization=y --useISODateFormat=y --includeEntryContent=n --includeOptionalElements=n
```

## License
The MIT License (MIT)

---
