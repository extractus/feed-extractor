// parseJsonFeed.js

// specs: https://www.jsonfeed.org/version/1.1/

import { isArray } from 'bellajs'

import {
  toISODateString,
  buildDescription,
  getEntryId,
  getHref
} from './normalizer.js'

import { purify as purifyUrl } from './linker.js'

const transform = (item, options, hostname) => {
  const {
    useISODateFormat,
    descriptionMaxLen,
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
    link: purifyUrl(link) || getHref(link, hostname),
    published,
    description: buildDescription(textContent || htmlContent || summary, descriptionMaxLen),
  }

  return {
    ...entry,
    ...extraFields,
  }
}

const parseJson = (data, options, hostname) => {
  const {
    normalization,
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
    link: purifyUrl(homepageUrl) || getHref(homepageUrl, hostname),
    description,
    language,
    published: '',
    generator: '',
    ...extraFields,
    entries: items.map((item) => {
      return transform(item, options, hostname)
    }),
  }
}

export default (data, options = {}, hostname) => {
  return parseJson(data, options, hostname)
}
