# feed-reader

Parse RSS/ATOM data from given feed url.

[![NPM](https://badge.fury.io/js/feed-reader.svg)](https://badge.fury.io/js/feed-reader)
![CI test](https://github.com/ndaidong/feed-reader/workflows/ci-test/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/feed-reader/badge.svg?updated=1)](https://coveralls.io/github/ndaidong/feed-reader)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ndaidong_feed-reader&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=ndaidong_feed-reader)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


### Usage

```bash
npm install feed-reader
```

Then

```js
const {
  parse
} = require('feed-reader')

const url = 'https://news.google.com/rss'

parse(url).then((feed) => {
  console.log(feed)
}).catch((err) => {
  console.log(err)
})
```

## APIs

This lib provides only method `parse()`.

#### parse(String url)

Return: a Promise

Here is how we can use `feed-reader`:

```js
import {
  parse
} from 'feed-reader'

const getFeedData = async (url) => {
  try {
    console.log(`Get feed data from ${url}`)
    const data = await parse(url)
    console.log(data)
    return data
  } catch (err) {
    console.trace(err)
  }
}

getFeedData('https://news.google.com/rss')
getFeedData('https://news.google.com/atom')
```

Example feed data:

```json
{
  "title": "Top stories - Google News",
  "link": "https://news.google.com/atom?hl=en-US&gl=US&ceid=US%3Aen",
  "description": "Google News",
  "generator": "NFE/5.0",
  "language": "",
  "published": "Tue, Nov 23, 2021  05:58:17 PM",
  "entries": [
    {
      "title": "Lone suspect in Waukesha parade crash to appear in court today, as Wisconsin reels from tragedy that left 5 dead and dozens more injured - CNN",
      "link": "https://news.google.com/__i/rss/rd/articles/CBMiTmh0dHBzOi8vd3d3LmNubi5jb20vMjAyMS8xMS8yMy91cy93YXVrZXNoYS1jYXItcGFyYWRlLWNyb3dkLXR1ZXNkYXkvaW5kZXguaHRtbNIBUmh0dHBzOi8vYW1wLmNubi5jb20vY25uLzIwMjEvMTEvMjMvdXMvd2F1a2VzaGEtY2FyLXBhcmFkZS1jcm93ZC10dWVzZGF5L2luZGV4Lmh0bWw?oc=5",
      "description": "Lone suspect in Waukesha parade crash to appear in court today, as Wisconsin reels from tragedy that left 5 dead and dozens more injured &nbsp;&nbsp; CNN Waukesha Christmas parade attack: 5 dead, 48 injured, Darrell Brooks named as...",
      "published": "Tue, Nov 23, 2021  05:34:00 PM"
    },
    // ...
  ]
}
```


## Test


```bash
git clone https://github.com/ndaidong/feed-reader.git
cd feed-reader
npm install

# evaluation
npm run eval https://news.google.com/rss
npm test
```


# License

The MIT License (MIT)
