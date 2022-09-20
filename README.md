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

### Usage

```js
import { read } from 'feed-reader'

// with CommonJS environments
// const { read } = require('feed-reader/dist/cjs/feed-reader.js')

const url = 'https://news.google.com/rss'

read(url).then((feed) => {
  console.log(feed)
}).catch((err) => {
  console.log(err)
})
```

## APIs


### `read(String url [, Object options])`

Load and extract feed data from given RSS/ATOM/JSON source. Return a Promise object.

#### `url`

URL of a valid feed source

Feed content must be accessible and conform one of the following standards:

  - [RSS Feed](https://www.rssboard.org/rss-specification)
  - [ATOM Feed](https://datatracker.ietf.org/doc/html/rfc5023)
  - [JSON Feed](https://www.jsonfeed.org/version/1.1/)

#### `options`

Object with all or several of the following properties:

  - `normalization`: Boolean, normalize feed data or keep original. Default `true`.
  - `includeEntryContent`: Boolean, include full content of feed entry if present. Default `false`.
  - `includeOptionalElements`: Boolean, include optional elements. Default `false`.
  - `useISODateFormat`: Boolean, convert datetime to ISO format. Default `true`.
  - `descriptionMaxLen`: Number, to truncate description. Default `210` (characters).

Note that when `normalization` is set to `false`, other options will take no effect to the last output.


Example:

```js
import {
  read
} from 'feed-reader'

const getFeedData = async (url) => {
  try {
    console.log(`Get feed data from ${url}`)
    const result = await read(url)
    // result may be feed data or null
    console.log(result)
    return result
  } catch (err) {
    console.trace(err)
  }
}

getFeedData('https://news.google.com/rss')
getFeedData('https://news.google.com/atom')
getFeedData('https://adactio.com/journal/feed.json')
```

With default options, feed data object retuned by `read()` method should look like below:

```json
{
  "title": "Top stories - Google News",
  "link": "https://news.google.com/atom?hl=en-US&gl=US&ceid=US%3Aen",
  "description": "Google News",
  "generator": "NFE/5.0",
  "language": "",
  "published": "2021-12-23T15:01:12.000Z",
  "entries": [
    {
      "title": "Lone suspect in Waukesha parade crash to appear in court today, as Wisconsin reels from tragedy that left 5 dead and dozens more injured - CNN",
      "link": "https://news.google.com/__i/rss/rd/articles/CBMiTmh0dHBzOi8vd3d3LmNubi5jb20vMjAyMS8xMS8yMy91cy93YXVrZXNoYS1jYXItcGFyYWRlLWNyb3dkLXR1ZXNkYXkvaW5kZXguaHRtbNIBUmh0dHBzOi8vYW1wLmNubi5jb20vY25uLzIwMjEvMTEvMjMvdXMvd2F1a2VzaGEtY2FyLXBhcmFkZS1jcm93ZC10dWVzZGF5L2luZGV4Lmh0bWw?oc=5",
      "description": "Lone suspect in Waukesha parade crash to appear in court today, as Wisconsin reels from tragedy that left 5 dead and dozens more injured &nbsp;&nbsp; CNN Waukesha Christmas parade attack: 5 dead, 48 injured, Darrell Brooks named as...",
      "published": "2021-12-21T22:30:00.000Z"
    },
    // ...
  ]
}
```

## Quick evaluation

```bash
git clone https://github.com/ndaidong/feed-reader.git
cd feed-reader
npm install

node eval.js --url=https://news.google.com/rss --normalization=y --useISODateFormat=y --includeEntryContent=n
```


## License
The MIT License (MIT)

---
