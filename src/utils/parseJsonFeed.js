// parseJsonFeed.js

// specs: https://www.jsonfeed.org/version/1.1/

import { isArray } from 'bellajs'

import {
  toISODateString,
  buildDescription
} from './normalizer.js'

import { purify as purifyUrl } from './linker.js'

const transform = (item, options) => {
  const {
    includeEntryContent,
    useISODateFormat,
    descriptionMaxLen,
    extraEntryFields,
  } = options

  const {
    title = '',
    url: link = '',
    date_published: pubDate = '',
    summary = '',
    content_html: htmlContent = '',
    content_text: textContent = ''
  } = item

  const published = useISODateFormat ? toISODateString(pubDate) : pubDate
  const extraFields = extraEntryFields(item);

  const entry = {
    title,
    link: purifyUrl(link),
    published,
    description: buildDescription(textContent || htmlContent || summary, descriptionMaxLen)
  }
  if (includeEntryContent) {
    entry.content = htmlContent || textContent || summary
  }
  return {
    ...entry,
    ...extraFields,
  } 
}

const parseJson = (data, options) => {
  const {
    normalization,
    extraFeedFields,
   } = options
  if (!normalization) {
    return data
  }

  const {
    title = '',
    home_page_url: homepageUrl = '',
    description = '',
    language = '',
    items: item = []
  } = data

  const extraFields = extraFeedFields(data);

  const items = isArray(item) ? item : [item]

  return {
    title,
    link: purifyUrl(homepageUrl),
    description,
    language,
    published: '',
    generator: '',
    ...extraFields,
    entries: items.map((item) => {
      return transform(item, options)
    })
  }
}

export default (data, options = {}) => {
  return parseJson(data, options)
}
