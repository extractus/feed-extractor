// parseJsonFeed.js

// specs: https://www.jsonfeed.org/version/1.1/

import { isArray } from 'bellajs'

import {
  toISODateString,
  buildDescription
} from './normalizer.js'

import { getReaderOptions } from '../config.js'

const transform = (item) => {
  const {
    includeFullContent,
    convertPubDateToISO
  } = getReaderOptions()

  const {
    title,
    url: link,
    date_published: pubDate,
    summary,
    content_html: htmlContent,
    content_text: textContent
  } = item

  const published = convertPubDateToISO ? toISODateString(pubDate) : pubDate
  const entry = {
    title,
    link,
    published,
    description: buildDescription(textContent || htmlContent || summary)
  }
  if (includeFullContent) {
    entry.content = htmlContent || textContent || summary
  }
  return entry
}

const parseJson = (data) => {
  const {
    title = '',
    home_page_url = '',
    description = '',
    language = '',
    items: item = []
  } = data

  const items = isArray(item) ? item : [item]

  return {
    title,
    link: home_page_url,
    description,
    language,
    published: '',
    generator: '',
    entries: items.map(transform)
  }
}

export default (data) => {
  return parseJson(data)
}
