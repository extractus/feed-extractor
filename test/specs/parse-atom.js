/**
 * Testing
 * @ndaidong
 */

var fs = require('fs');
var test = require('tape');
var nock = require('nock');
var bella = require('bellajs');

var parse = require('../../src/main').parse;

const URL = 'http://use.perl.org/use.perl.org/index.atom';
const DATA = fs.readFileSync('./test/data/sample-atom.txt', 'utf8');

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

(() => {

  nock(URL)
    .get('')
    .reply(200, DATA);


  test(`Parse ATOM feed: .parse(${URL})`, {timeout: 5000}, (t) => {

    parse(URL).then((feed) => {

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

})();
