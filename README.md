# feed-reader

Extract ATOM/RSS content from given feed url.

[![NPM](https://badge.fury.io/js/feed-reader.svg)](https://badge.fury.io/js/feed-reader)
![CI test](https://github.com/ndaidong/feed-reader/workflows/ci-test/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/feed-reader/badge.svg)](https://coveralls.io/github/ndaidong/feed-reader)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ndaidong_feed-reader&metric=alert_status)](https://sonarcloud.io/dashboard?id=ndaidong_feed-reader)
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

const url = 'https://news.google.com/news/feeds?pz=1&cf=all&ned=us&hl=en&q=nodejs&output=rss'

parse(url).then((feed) => {
  console.log(feed)
}).catch((err) => {
  console.log(err)
})
```


## Test


```bash
git clone https://github.com/ndaidong/feed-reader.git
cd feed-reader
npm install
npm test
```


# License

The MIT License (MIT)
