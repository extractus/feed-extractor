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

- [.read(String url)](#readstring-url)
- [Configuration methods](#configuration-methods)

### read(String url)

Load and extract feed data from given RSS/ATOM/JSON source. Return a Promise object.

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

Feed data object retuned by `read()` method should look like below:

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

### Configuration methods

#### `setRequestOptions(Object requestOptions)`

Affect to the way how `axios` works. Please refer [axios' request config](https://axios-http.com/docs/req_config) for more info.

#### `getRequestOptions()`

Return current request options.

Default values can be found [here](https://github.com/ndaidong/feed-reader/blob/main/src/config.js#L5).

#### `setReaderOptions(Object readerOptions)`

To change default reader options.

- `descriptionMaxLen`: Number, max num of chars for description (default: `210`)
- `includeFullContent`: Boolean, add `content` to entry if available (default: `false`)
- `convertPubDateToISO`: Boolean, reformat published date to [ISO standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (default: `true`)

#### `getReaderOptions()`

Return current reader options.


## Test

```bash
git clone https://github.com/ndaidong/feed-reader.git
cd feed-reader
npm install

# quick evaluation
npm run eval https://news.google.com/rss
npm test
```

## License
The MIT License (MIT)

---
