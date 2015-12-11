# feed-reader
Util for parse ATOM and RSS feed resources and normalize them to JSON object.

 [![NPM](https://badge.fury.io/js/oembed-auto-es6.svg)](https://badge.fury.io/js/oembed-auto-es6)
 ![Travis](https://travis-ci.org/techpush/feed-reader.svg?branch=master)

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
