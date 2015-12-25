/**
 * Testing
 * @ndaidong
 */

/* global describe it before after */
/* eslint no-undefined: 0*/
/* eslint no-array-constructor: 0*/
/* eslint no-new-func: 0*/
/* eslint no-console: 0*/

'use strict';

var chai = require('chai');

chai.should();
var expect = chai.expect;

var FR = require('../../../src/feed-reader');
var parse = FR.parse;

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

var testOne = (url) => {
  describe('.parse("' + url + '")', () => {

    let feed;

    before((done) => {
      parse(url).then((res) => {
        feed = res;
      }).catch((e) => {
        console.log(e);
        return false;
      }).finally(done);
    });

    describe('Checking main structure...', () => {

      it(' should be object', (done) => {
        expect(feed).to.be.an('object');
        done();
      });

      it(' should have required properties', (done) => {
        expect(feed).to.include.keys(['link', 'title', 'entries']);
        done();
      });

      it(' link must be string, not empty', (done) => {
        expect(feed.link).to.be.a('string');
        expect(feed.link).to.have.length.at.least(1);
        done();
      });
      it(' title must be string, not empty', (done) => {
        expect(feed.title).to.be.a('string');
        expect(feed.title).to.have.length.at.least(1);
        done();
      });
      it(' entries must be array, not empty', (done) => {
        expect(feed.entries).to.be.an('array');
        expect(feed.entries).to.have.length.at.least(1);
        done();
      });

      after((complete) => {
        var testEvery = (entry) => {
          describe('Checking an entry...', () => {
            it(' should be object', (done) => {
              expect(entry).to.be.an('object');
              done();
            });

            it(' should have required properties', (done) => {
              expect(entry).to.include.keys(['link', 'title', 'contentSnippet', 'publishedDate', 'content']);
              done();
            });

            it(' link must be string, not empty', (done) => {
              expect(entry.link).to.be.a('string');
              expect(entry.link).to.have.length.at.least(1);
              done();
            });
            it(' title must be string, not empty', (done) => {
              expect(entry.title).to.be.a('string');
              expect(entry.title).to.have.length.at.least(1);
              done();
            });
            it(' contentSnippet must be string, not empty', (done) => {
              expect(entry.contentSnippet).to.be.a('string');
              expect(entry.contentSnippet).to.have.length.at.least(1);
              done();
            });
            it(' publishedDate must be string, not empty', (done) => {
              expect(entry.publishedDate).to.be.a('string');
              expect(entry.publishedDate).to.have.length.at.least(1);
              done();
            });
          });
        };
        feed.entries.map(testEvery);
        complete();
      });

    });
  });
};

samples.map(testOne);
