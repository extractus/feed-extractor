# feed-reader

Load and parse RSS/ATOM data from given feed url.

[![NPM](https://badge.fury.io/js/feed-reader.svg)](https://badge.fury.io/js/feed-reader)
![CI test](https://github.com/ndaidong/feed-reader/workflows/ci-test/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/feed-reader/badge.svg?updated=1)](https://coveralls.io/github/ndaidong/feed-reader)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ndaidong_feed-reader&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=ndaidong_feed-reader)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Demo

- [Give it a try!](https://demos.pwshub.com/feed-reader)
- [Example FaaS](https://extractor.pwshub.com/feed/parse?url=https://news.google.com/rss&apikey=demo-orePhhidnWKWPvF8EYKap7z55cN)

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

##### Note:

> Since Node.js v14, ECMAScript modules [have became the official standard format](https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_modules_ecmascript_modules).
> Just ensure that you are [using module system](https://nodejs.org/api/packages.html#determining-module-system) and enjoy with ES6 import/export syntax.


## APIs

- [.read(String url)](#readstring-url)
- [Configuration methods](#configuration-methods)

#### read(String url)

Load and extract feed data from given RSS/ATOM source. Return a Promise object.

Example:

```js
import {
  read
} from 'feed-reader'

const getFeedData = async (url) => {
  try {
    console.log(`Get feed data from ${url}`)
    const data = await read(url)
    console.log(data)
    return data
  } catch (err) {
    console.trace(err)
  }
}

getFeedData('https://news.google.com/rss')
getFeedData('https://news.google.com/atom')
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

#### Configuration methods

In addition, this lib provides some methods to customize default settings. Don't touch them unless you have reason to do that.

- getRequestOptions()
- setRequestOptions(Object requestOptions)

#### Object `requestOptions`:

```js
{
  headers: {
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0'
  },
  responseType: 'text',
  responseEncoding: 'utf8',
  timeout: 6e4, // 1 minute
  maxRedirects: 3
}
```
Read [axios' request config](https://axios-http.com/docs/req_config) for more info.


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
