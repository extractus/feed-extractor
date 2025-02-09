// parseJsonFeed.js

// specs: https://www.jsonfeed.org/version/1.1/

import { isArray } from 'bellajs'

import {
  toISODateString,
  buildDescription,
  getEntryId,
  getPureUrl
} from './normalizer.js'

import { absolutify, purify as purifyUrl } from './linker.js'

const transform = (item, options) => {
  const {
    useISODateFormat,
    descriptionMaxLen,
    baseUrl,
    getExtraEntryFields,
  } = options

  const {
    id = '',
    title = '',
    url: link = '',
    date_published: pubDate = '',
    summary = '',
    content_html: htmlContent = '',
    content_text: textContent = '',
  } = item

  const published = useISODateFormat ? toISODateString(pubDate) : pubDate
  const extraFields = getExtraEntryFields(item)

  const entry = {
    id: getEntryId(id, link, pubDate),
    title,
    link: getPureUrl(link, '', baseUrl),
    published,
    description: buildDescription(textContent || htmlContent || summary, descriptionMaxLen),
  }

  return {
    ...entry,
    ...extraFields,
  }
}

const parseJson = (data, options) => {
  const {
    normalization,
    baseUrl,
    getExtraFeedFields,
  } = options

  if (!normalization) {
    return data
  }

  const {
    title = '',
    home_page_url: homepageUrl = '',
    description = '',
    language = '',
    items: item = [],
  } = data

  const extraFields = getExtraFeedFields(data)

  const items = isArray(item) ? item : [item]

  return {
    title,
    link: purifyUrl(homepageUrl) || absolutify(baseUrl, homepageUrl),
    description,
    language,
    published: '',
    generator: '',
    ...extraFields,
    entries: items.map((item) => {
      return transform(item, options)
    }),
  }
}

export default (data, options = {}) => {
  return parseJson(data, options)
}
