/**
 * Testing
 * @ndaidong
 */

/* eslint no-undefined: 0*/
/* eslint no-array-constructor: 0*/
/* eslint no-new-func: 0*/

var test = require('tape');
var bella = require('bellajs');

var parse = require('../../src/main').parse;

var hasRequiredKeys = (o) => {
  let structure = [
    'link',
    'title',
    'contentSnippet',
    'publishedDate',
    'author',
    'content'
  ];

  return structure.every((k) => {
    return bella.hasProperty(o, k);
  });
};

var isGoodEntry = (prop, isRequired = true) => {
  if (!bella.isString(prop)) {
    return false;
  }
  if (isRequired && prop.length <= 0) {
    return false;
  }
  return true;
};

let samples = [
  'https://www.twilio.com/blog/feed',
  'http://blog.ghost.org/rss/',
  'http://blog.nodejs.org/feed',
  'https://medium.com/feed/google-developers',
  'http://feeds.feedburner.com/2ality',
  'http://uxmag.com/uxm.xml',
  'http://blog.mongodb.org/rss',
  'http://www.neotechnology.com/feed/',
  'http://www.smashingmagazine.com/feed/',
  'https://hacks.mozilla.org/feed/',
  'https://news.google.com/news/feeds?pz=1&cf=all&ned=us&hl=en&q=javascript&output=rss'
];

var testOneEntry = (entry, t) => {
  t.ok(bella.isObject(entry), 'entry must be an object.');
  t.ok(hasRequiredKeys(entry), 'entry must have required keys');
  t.ok(isGoodEntry(entry.link), 'entry.link must be valid.');
  t.ok(isGoodEntry(entry.title), 'entry.title must be valid.');
  t.ok(isGoodEntry(entry.contentSnippet), 'entry.contentSnippet must be valid.');
  t.ok(isGoodEntry(entry.publishedDate), 'entry.publishedDate must be valid.');
  t.ok(isGoodEntry(entry.author, false), 'entry.author must be valid.');
  t.ok(isGoodEntry(entry.content, false), 'entry.content must be valid.');
};

var testOne = (url) => {

  test(`Calling .parse(${url})`, {timeout: 15000}, (t) => {

    parse(url).then((feed) => {
      t.comment(`Checking result from ${url}:`);

      t.ok(bella.isObject(feed), 'feed must be an object.');

      t.ok(isGoodEntry(feed.title), 'feed.title must be valid.');
      t.ok(isGoodEntry(feed.link), 'feed.link must be valid.');

      t.ok(bella.isArray(feed.entries), 'feed.entries must be an array.');
      t.ok(feed.entries.length > 0, 'feed.entries is not empty.');
      feed.entries.forEach((item) => {
        testOneEntry(item, t);
      });
    }).catch((e) => {
      console.log(e);
    }).finally(t.end);
  });

};

samples.map(testOne);
