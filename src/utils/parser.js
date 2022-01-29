// utils / parser

import { decode } from 'html-entities'

import {
  isString,
  isArray,
  isObject,
  hasProperty,
  stripTags,
  truncate
} from 'bellajs'

import purifyUrl from './purifyUrl.js'

const toISODateString = (dstr) => {
  try {
    return (new Date(dstr)).toISOString()
  } catch (err) {
    return ''
  }
}

const toDate = (val) => {
  return val ? toISODateString(val) : ''
}

const toText = (val) => {
  const txt = isObject(val) ? (val._text || val['#text'] || val._cdata || val.$t) : val
  return txt ? decode(String(txt).trim()) : ''
}

const toDesc = (val) => {
  const txt = toText(val)
  // const stripped = stripTags(txt)
  // return truncate(stripped, 240)
  return txt;
}

const toLink = (val) => {
  const getEntryLink = (links) => {
    const link = links.find((item) => {
      return item.rel === 'alternate'
    })
    return link ? toText(link.href) : ''
  }
  return isString(val)
    ? toText(val)
    : isObject(val) && hasProperty(val, 'href')
      ? toText(val.href)
      : isObject(val) && hasProperty(val, '@_href')
        ? toText(val['@_href'])
        : isObject(val) && hasProperty(val, '_attributes')
          ? toText(val._attributes.href)
          : isArray(val) ? toLink(val[0]) : getEntryLink(val)
}

const nomalizeRssItem = (entry) => {
  return {
    title: toText(entry.title),
    link: purifyUrl(toLink(entry.link)),
    description: toDesc(entry.description),
    published: toDate(toText(entry.pubDate))
  }
}

const nomalizeAtomItem = (entry) => {
  return {
    title: toText(entry.title),
    link: purifyUrl(toLink(entry.link)),
    description: toDesc(entry?.["media:group"]?.["media:description"] || entry.summary || entry.description || entry.content),
    thumbnail: entry?.["media:group"]?.["media:thumbnail"]?.["@_url"],
    published: toDate(toText(entry.updated || entry.published))
  }
}

export const parseRSS = (xmldata) => {
  const { rss = {} } = xmldata
  const { channel = {} } = rss
  const {
    title = '',
    link = '',
    description = '',
    generator = '',
    language = '',
    lastBuildDate = '',
    item = []
  } = channel

  const entries = isArray(item) ? item.map(nomalizeRssItem) : [nomalizeRssItem(item)]

  return {
    title,
    link: purifyUrl(link),
    description,
    generator,
    language,
    published: toDate(lastBuildDate),
    entries
  }
}

export const parseAtom = (xmldata) => {
  const { feed = {} } = xmldata
  const {
    title = '',
    link = '',
    subtitle = '',
    generator = '',
    language = '',
    updated = '',
    entry = []
  } = feed

  const entries = isArray(entry) ? entry.map(nomalizeAtomItem) : [nomalizeAtomItem(entry)]

  return {
    title: toText(title),
    link: purifyUrl(toLink(link)),
    description: subtitle,
    generator,
    language,
    published: toDate(updated),
    entries
  }
}
