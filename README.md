# feed-reader

To read & normalize RSS/ATOM/JSON feed data.

[![NPM](https://badge.fury.io/js/feed-reader.svg)](https://badge.fury.io/js/feed-reader)
![CI test](https://github.com/ndaidong/feed-reader/workflows/ci-test/badge.svg)
[![Coverage Status](https://img.shields.io/coveralls/github/ndaidong/feed-reader)](https://coveralls.io/github/ndaidong/feed-reader?branch=main)
![CodeQL](https://github.com/ndaidong/feed-reader/workflows/CodeQL/badge.svg)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Deploy](https://button.deta.dev/1/svg)](https://go.deta.dev/deploy?repo=https://github.com/ndaidong/feed-reader-deta)

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

```js
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

```js
import { read } from 'https://unpkg.com/feed-reader@latest/dist/feed-reader.esm.js'
```

View [more examples](https://github.com/ndaidong/feed-reader/tree/main/examples).


## APIs

### `read()`

Load and extract feed data from given RSS/ATOM/JSON source. Return a Promise object.

#### Syntax

```js
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

```js
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
  - `includeEntryContent`: Boolean, include full content of feed entry if present. Default `false`.
  - `includeOptionalElements`: Boolean, include optional elements. Default `false`.
  - `useISODateFormat`: Boolean, convert datetime to ISO format. Default `true`.
  - `descriptionMaxLen`: Number, to truncate description. Default `210` (characters).

Note that when `normalization` is set to `false`, other options will take no effect to the last output.

For example:

```js
import { read } from 'feed-reader'

read('https://news.google.com/atom', {
  useISODateFormat: false
})

read('https://news.google.com/rss', {
  useISODateFormat: false,
  includeOptionalElements: true
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
