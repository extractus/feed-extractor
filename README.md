# feed-reader

Extract ATOM/RSS content from given feed url.


[![NPM](https://badge.fury.io/js/feed-reader.svg)](https://badge.fury.io/js/feed-reader)
[![Build Status](https://travis-ci.org/ndaidong/feed-reader.svg?branch=master)](https://travis-ci.org/ndaidong/feed-reader)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/feed-reader/badge.svg?branch=master)](https://coveralls.io/github/ndaidong/feed-reader?branch=master)


### Usage

```bash
npm install feed-reader
```

Then

```js
const {
  parse
} = require('feed-reader');


const url = 'https://news.google.com/news/feeds?pz=1&cf=all&ned=us&hl=en&q=nodejs&output=rss';

parse(url).then((feed) => {
  console.log(feed);
}).catch((err) => {
  console.log(err);
});

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
