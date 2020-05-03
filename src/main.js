/**
 * Feed Reader
 * @ndaidong
 **/

import fetch from 'node-fetch';
import convert from 'xml-js';

import {XmlEntities} from 'html-entities';

import {
  isString,
  isArray,
  isObject,
  hasProperty,
  stripTags,
  truncate,
  md5,
  utc as formatDate,
} from 'bellajs';

import {contentLoadedCache} from './utils/store';
import {info} from './utils/logger';


const Entity = new XmlEntities();

const isRSS = (data) => {
  return hasProperty(data, 'rss') && data.rss.channel;
};

const isAtom = (data) => {
  return hasProperty(data, 'feed') && data.feed.entry;
};

const toDate = (val) => {
  const td = val ? new Date(val) : false;
  return td ? formatDate(td) : '';
};

const toText = (val) => {
  const txt = isObject(val) ? (val._text || val._cdata || val.$t) : val;
  return txt ? Entity.decode(String(txt).trim()) : '';
};

const toDesc = (val) => {
  const txt = toText(val);
  const stripped = stripTags(txt);
  return truncate(stripped, 240);
};

const toLink = (val) => {
  const getEntryLink = (links) => {
    const link = links.find((item) => {
      return item.rel === 'alternate';
    });
    return link ? toText(link.href) : '';
  };
  return isString(val) ? toText(val) :
    isObject(val) && hasProperty(val, 'href') ? toText(val.href) :
      isObject(val) && hasProperty(val, '_attributes') ? toText(val._attributes.href) :
        isArray(val) ? getEntryLink(val) : '';
};

const nomalizeRssItem = (entry) => {
  return {
    title: toText(entry.title),
    link: toLink(entry.link),
    description: toDesc(entry.description),
    pubDate: toDate(toText(entry.pubDate)),
  };
};

const nomalizeAtomItem = (entry) => {
  console.log(entry);
  console.log(entry.content.div);
  return {
    title: toText(entry.title),
    link: toLink(entry.link),
    description: toDesc(entry.summary || entry.description),
    pubDate: toDate(toText(entry.updated || entry.published)),
  };
};

const parseRSS = (data) => {
  const channel = data.rss.channel;
  const items = channel.item || [];
  return {
    title: toText(channel.title),
    pubDate: toDate(toText(channel.pubDate)),
    entries: items.map(nomalizeRssItem),
  };
};

const parseAtom = (data) => {
  const feed = data.feed;
  const items = feed.entry || [];
  return {
    title: toText(feed.title),
    pubDate: toDate(toText(feed.updated || feed.published)),
    entries: items.map(nomalizeAtomItem),
  };
};


const getXML = async (url) => {
  info(`Fetching html data from '${url}'`);
  const opts = {
    headers: {
      'cache-control': 'max-age=0',
      'accept': [
        'text/html',
        'application/xhtml+xml',
        'application/xml;q=0.9',
        'image/webp',
        'image/apng',
        '*/*;q=0.8',
        'application/signed-exchange;v=b3;q=0.9',
      ].join(','),
      'user-agent': [
        'Mozilla/5.0',
        '(X11; Linux x86_64)',
        'AppleWebKit/537.36',
        '(KHTML, like Gecko)',
        'Chrome/81.0.4044.129 Safari/537.36',
      ].join(' '),
    },
  };
  const res = await fetch(url, opts);
  const content = await res.text();
  info(`Done! Fetched data from '${url}. Saving into cache...'`);
  const key = md5(url);
  contentLoadedCache.set(key, content);
  return content;
};

export const parse = async (url) => {
  const content = await getXML(url);
  const result = convert.xml2js(content, {compact: true, spaces: 2});
  return isRSS(result) ? parseRSS(result) :
    isAtom(result) ? parseAtom(result) : null;
};
