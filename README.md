# feed-reader
Util for parse ATOM and RSS feed resources and normalize them to JSON object.

 [![NPM](https://badge.fury.io/js/feed-reader.svg)](https://badge.fury.io/js/feed-reader)
 ![Travis](https://travis-ci.org/ndaidong/feed-reader.svg?branch=master)
 [![Coverage Status](https://coveralls.io/repos/github/ndaidong/feed-reader/badge.svg?branch=master)](https://coveralls.io/github/ndaidong/feed-reader?branch=master)
 ![devDependency Status](https://david-dm.org/ndaidong/feed-reader.svg)
 [![Known Vulnerabilities](https://snyk.io/test/npm/feed-reader/badge.svg)](https://snyk.io/test/npm/feed-reader)

### Installation

```
npm install feed-reader
```

### Usage

```
import FeedReader from 'feed-reader';

let url = 'https://news.google.com/news/feeds?pz=1&cf=all&ned=us&hl=en&q=nodejs&output=rss';

FeedReader.parse(url).then((feed) => {
  console.log(feed);
}).catch((err) => {
  console.log(err);
});
```


## Test

```
git clone https://github.com/ndaidong/feed-reader.git
cd feed-reader
npm install
mocha
```

 _* Ensure that you have [mocha](https://mochajs.org/) installed_
