// parseAtomFeed.js

// specs: https://datatracker.ietf.org/doc/html/rfc5023
// refer: https://validator.w3.org/feed/docs/atom.html

import { isArray, hasProperty } from 'bellajs'

import {
  getText,
  toISODateString,
  buildDescription,
  getPureUrl,
  getEntryId
} from './normalizer.js'

const transform = (item, options) => {
  const {
    useISODateFormat,
    descriptionMaxLen,
    getExtraEntryFields,
  } = options

  const {
    id = '',
    title = '',
    issued = '',
    modified = '',
    updated = '',
    published = '',
    link = '',
    summary = '',
    content = '',
  } = item

  const pubDate = updated || modified || published || issued
  const htmlContent = getText(content || summary)
  const entry = {
    id: getEntryId(id, link, pubDate),
    title: getText(title),
    link: getPureUrl(link, id),
    published: useISODateFormat ? toISODateString(pubDate) : pubDate,
    description: buildDescription(htmlContent || summary, descriptionMaxLen),
  }

  const extraFields = getExtraEntryFields(item)

  return {
    ...entry,
    ...extraFields,
  }
}

const flatten = (feed) => {
  const {
    id,
    title = '',
    link = '',
    entry,
  } = feed

  const entries = isArray(entry) ? entry : [entry]
  const items = entries.map((entry) => {
    const {
      id,
      title = '',
      link = '',
      summary = '',
      content = '',
    } = entry
    const item = {
      ...entry,
      title: getText(title),
      link: getPureUrl(link, id),
    }
    if (hasProperty(item, 'summary')) {
      item.summary = getText(summary)
    }
    if (hasProperty(item, 'content')) {
      item.content = getText(content)
    }
    return item
  })

  const output = {
    ...feed,
    title: getText(title),
    link: getPureUrl(link, id),
    entry: isArray(entry) ? items : items[0],
  }
  return output
}

const parseAtom = (data, options = {}) => {
  const {
    normalization,
    getExtraFeedFields,
  } = options

  if (!normalization) {
    return flatten(data.feed)
  }

  const {
    id = '',
    title = '',
    link = '',
    subtitle = '',
    generator = '',
    language = '',
    updated = '',
    entry: item = [],
  } = data.feed

  const extraFields = getExtraFeedFields(data.feed)

  const items = isArray(item) ? item : [item]

  const published = options.useISODateFormat ? toISODateString(updated) : updated

  return {
    title: getText(title),
    link: getPureUrl(link, id),
    description: subtitle,
    language,
    generator,
    published,
    ...extraFields,
    entries: items.map((item) => {
      return transform(item, options)
    }),
  }
}

export default (data, options = {}) => {
  return parseAtom(data, options)
}
