/**
 * Testing
 * @ndaidong
 */

const fs = require('fs');
const test = require('tape');
const nock = require('nock');
const bella = require('bellajs');

const {
  error,
} = require('../../src/utils/logger');

const parse = require('../../src/main').parse;

const URL = 'http://abc.com/rss';
const DATA = fs.readFileSync('./test/data/sample-rss-catch.txt', 'utf8');

const hasRequiredKeys = (o) => {
  let structure = [
    'link',
    'title',
    'contentSnippet',
    'publishedDate',
    'author',
    'content',
  ];

  return structure.every((k) => {
    return bella.hasProperty(o, k);
  });
};

const isGoodEntry = (prop, isRequired = true) => {
  if (!bella.isString(prop)) {
    return false;
  }
  if (isRequired && prop.length <= 0) {
    return false;
  }
  return true;
};

const testOneEntry = (entry, t) => {
  t.ok(bella.isObject(entry), 'entry must be an object.');
  t.ok(hasRequiredKeys(entry), 'entry must have required keys');
  t.ok(isGoodEntry(entry.link), 'entry.link must be valid.');
  t.ok(isGoodEntry(entry.title), 'entry.title must be valid.');
  t.ok(isGoodEntry(entry.contentSnippet), 'entry.contentSnippet must be valid.');
  t.ok(isGoodEntry(entry.publishedDate), 'entry.publishedDate must be valid.');
  t.ok(isGoodEntry(entry.author, false), 'entry.author must be valid.');
  t.ok(isGoodEntry(entry.content, false), 'entry.content must be valid.');
};

(() => {
  nock(URL)
    .get('')
    .reply(200, DATA);

  test(`Parse RSS feed: .parse(${URL})`, {timeout: 5000}, (t) => {
    parse(URL).then((feed) => {
      t.ok(bella.isObject(feed), 'feed must be an object.');
      t.ok(isGoodEntry(feed.title), 'feed.title must be valid.');
      t.ok(isGoodEntry(feed.link), 'feed.link must be valid.');
      t.ok(bella.isArray(feed.entries), 'feed.entries must be an array.');
      t.ok(feed.entries.length > 0, 'feed.entries is not empty.');
      feed.entries.forEach((item) => {
        testOneEntry(item, t);
      });
    }).catch(error).finally(t.end);
  });
})();


(() => {
  nock(URL)
    .get('')
    .reply(404, 0);

  test(`Fetch RSS feed: fail`, {timeout: 5000}, (t) => {
    parse(URL).catch((e) => {
      t.equals(e.message, `Fetching failed: ${URL}`, 'Error occurs while fetching RSS');
    }).finally(t.end);
  });
})();

(() => {
  nock(URL)
    .get('')
    .reply(200, 'hello world');

  test(`Parse RSS feed: fail`, {timeout: 5000}, (t) => {
    parse(URL).catch((e) => {
      t.equals(e.message, `Parsing failed: ${URL}`, 'Error occurs while parsing RSS');
    }).finally(t.end);
  });
})();
