# feed-reader

Load and parse RSS/ATOM data from given feed url.

[![NPM](https://badge.fury.io/js/feed-reader.svg)](https://badge.fury.io/js/feed-reader)
![CI test](https://github.com/ndaidong/feed-reader/workflows/ci-test/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/feed-reader/badge.svg?updated=1)](https://coveralls.io/github/ndaidong/feed-reader)
![CodeQL](https://github.com/ndaidong/feed-reader/workflows/CodeQL/badge.svg)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Demo

- [Give it a try!](https://demos.pwshub.com/feed-reader)
- [Example FaaS](https://extractor.pwshub.com/feed/parse?url=https://news.google.com/rss&apikey=demo-TEyRycuuMCiGBiBocbLGSpagfj7gOF8AMyAWfEgP)

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
- [The events](#the-events)
  - [.resetEvents()](#reset-event-listeners)
- [Configuration methods](#configuration-methods)

### read(String url)

Load and extract feed data from given RSS/ATOM source. Return a Promise object.

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

### The events

Since v6.0.0, `feed-reader` supports event-driven pattern for easier writing code with more control.

- `onSuccess(Function callback)`
- `onError(Function callback)`
- `onComplete(Function callback)`

The following example will explain better than any word:

```js
import { read, onSuccess, onError, onComplete } from 'feed-reader'

onSuccess((feed, url) => {
  console.log(`Feed data from ${url} has been parsed successfully`)
  console.log('`feed` is always an object that contains feed data')
  console.log(feed)
})

onError((err, url) => {
  console.log(`Error occurred while processing ${url}`)
  console.log('There is a message and reason:')
  console.log(err)
})

onComplete((result, url) => {
  console.log(`Finish processing ${url}`)
  console.log('There may or may not be an error')
  console.log('`result` may be feed data or null')
  console.log(result)
})

read('https://news.google.com/rss')
read('https://google.com')
```

We can mix both style together, for example to handle the error:

```js
import { read, onError } from 'feed-reader'

onError((err, url) => {
  console.log(`Error occurred while processing ${url}`)
  console.log('There is a message and reason:')
  console.log(err)
})

const getFeedData = async (url) => {
  const result = await read(url)
  // `result` may be feed data or null
  return result
}

getFeedData('https://news.google.com/rss')
````

#### Reset event listeners

Use method `resetEvents()` when you want to clear registered listeners from all events.

```js
import { resetEvents } from 'feed-reader'

resetEvents()
````

### Configuration methods

#### `setRequestOptions(Object requestOptions)`

Affect to the way how `axios` works. Please refer [axios' request config](https://axios-http.com/docs/req_config) for more info.

#### `getRequestOptions()`

Return current request options.

Default values can be found [here](https://github.com/ndaidong/feed-reader/blob/main/src/config.js#L5).


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
