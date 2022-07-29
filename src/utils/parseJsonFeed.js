// parseJsonFeed.js

// specs: https://www.jsonfeed.org/version/1.1/

import { isArray } from 'bellajs'

import {
  toISODateString,
  buildDescription
} from './normalizer.js'

import { purify as purifyUrl } from './linker.js'

import { getReaderOptions } from '../config.js'

const transform = (item, includeFullContent, convertPubDateToISO) => {
  const {
    title = '',
    url: link = '',
    date_published: pubDate = '',
    summary = '',
    content_html: htmlContent = '',
    content_text: textContent = ''
  } = item

  const published = convertPubDateToISO ? toISODateString(pubDate) : pubDate

  const entry = {
    title,
    link: purifyUrl(link),
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
    home_page_url: homepageUrl = '',
    description = '',
    language = '',
    items: item = []
  } = data

  const items = isArray(item) ? item : [item]

  const {
    includeFullContent,
    convertPubDateToISO
  } = getReaderOptions()

  return {
    title,
    link: purifyUrl(homepageUrl),
    description,
    language,
    published: '',
    generator: '',
    entries: items.map((item) => {
      return transform(item, includeFullContent, convertPubDateToISO)
    })
  }
}

export default (data) => {
  return parseJson(data)
}
