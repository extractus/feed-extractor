// normalizer

import {
  isString,
  isObject,
  isArray,
  hasProperty,
  stripTags,
  truncateByChar
} from '@pwshub/bellajs'

import { decode } from 'html-entities'

import { absolutify, isValid as isValidUrl, purify as purifyUrl } from './linker.js'

/**
 * Convert a date string to ISO 8601 format.
 *
 * @param {string} dstr - Date string to convert
 * @returns {string} ISO date string, or empty string on failure
 */
export const toISODateString = (dstr) => {
  try {
    return dstr ? (new Date(dstr)).toISOString() : ''
  } catch {
    return ''
  }
}

/**
 * Strip HTML tags and optionally truncate a description string.
 *
 * @param {string} val - Raw description value
 * @param {number} [maxlen=0] - Maximum length (0 = no truncation)
 * @returns {string} Cleaned and optionally truncated description
 */
export const buildDescription = (val, maxlen = 0) => {
  const stripped = stripTags(String(val).trim().replace(/^<!\[CDATA\[|\]\]>$/g, ''))
  const text = maxlen > 0 ? truncateByChar(stripped, maxlen) : stripped
  return text.replace(/\n+/g, ' ')
}

/**
 * Extract text content from a parsed XML node.
 *
 * Handles multiple known property shapes: `_text`, `#text`, `_cdata`, `$t`.
 *
 * @param {*} val - Value to extract text from
 * @returns {string} Decoded and trimmed text content
 */
export const getText = (val) => {
  const txt = isObject(val) ? (val._text || val['#text'] || val._cdata || val.$t) : val
  return txt ? decode(String(txt).trim()) : ''
}

/**
 * Extract a URL link from a parsed XML node.
 *
 * Supports multiple link formats: string, `href`, `@_href`, `@_url`, `_attributes.href`.
 *
 * @param {*} val - Link value (string, object, or array)
 * @param {string|Object} [id=''] - GUID object or string for fallback URL
 * @returns {string} Extracted URL string
 */
export const getLink = (val = [], id = '') => {
  if (isObject(id) && hasProperty(id, '@_isPermaLink') && id['@_isPermaLink'] === 'true') {
    return getText(id)
  }
  const getEntryLink = (links) => {
    const items = links.map((item) => {
      return getLink(item)
    })
    return items.length > 0 ? items[0] : ''
  }
  const url = isString(val)
    ? getText(val)
    : isObject(val) && hasProperty(val, 'href')
      ? getText(val.href)
      : isObject(val) && hasProperty(val, '@_href')
        ? getText(val['@_href'])
        : isObject(val) && hasProperty(val, '@_url')
          ? getText(val['@_url'])
          : isObject(val) && hasProperty(val, '_attributes')
            ? getText(val._attributes.href)
            : isArray(val) ? getEntryLink(val) : ''

  return url ? url : isValidUrl(id) ? id : ''
}

/**
 * Extract a purified absolute URL from feed entry data.
 *
 * Will strip tracking params via `purify` and resolve relative URLs via `absolutify`.
 *
 * @param {*} url - Link value from feed entry
 * @param {string} [id=''] - Fallback identifier URL
 * @param {string} [baseUrl=''] - Base URL for resolving relative links
 * @returns {string} Purified absolute URL string
 */
export const getPureUrl = (url, id = '', baseUrl) => {
  const link = getLink(url, id)
  const pu = purifyUrl(link)

  return link
    ? pu
      ? pu
      : absolutify(baseUrl, link)
    : ''
}

/**
 * Generate a consistent hash from a string.
 *
 * @param {string} str - Input string
 * @returns {string} Base-36 encoded hash
 */
const hash = (str) => Math.abs(str.split('').reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0)).toString(36)

/**
 * Generate a stable entry ID from identifier, URL, and publication date.
 *
 * Falls back to a hash-based ID when no explicit identifier is available.
 *
 * @param {*} id - Entry identifier (guid/id) value
 * @param {string} url - Entry URL
 * @param {string} pubDate - Publication date string
 * @returns {string} Resolved entry ID
 */
export const getEntryId = (id, url, pubDate) => {
  return id ? getText(id) : hash(getPureUrl(url)) + '-' + (new Date(pubDate)).getTime()
}

/**
 * Extract enclosure metadata from a parsed XML node.
 *
 * @param {Object} val - Enclosure object with `@_url`, `@_type`, `@_length`
 * @returns {Object|null} Enclosure object `{ url, type, length }`, or null
 */
export const getEnclosure = (val) => {
  const url = hasProperty(val, '@_url') ? val['@_url'] : ''
  const type = hasProperty(val, '@_type') ? val['@_type'] : ''
  const length = Number(hasProperty(val, '@_length') ? val['@_length'] : 0)
  return !url || !type
    ? null
    : {
      url,
      type,
      length,
    }
}

/**
 * Build a category object from a parsed XML node.
 *
 * @param {*} v - Category value (string or object)
 * @returns {Object|string} Category object `{ text, domain }` or raw string
 */
const getCategory = (v) => {
  return isObject(v)
    ? {
      text: getText(v),
      domain: v['@_domain'],
    }
    : v
}

/**
 * Normalize optional feed/entry tags (source, category, enclosure).
 *
 * @param {*} val - Raw tag value
 * @param {string} key - Tag name
 * @returns {*} Normalized tag value
 */
export const getOptionalTags = (val, key) => {
  if (key === 'source') {
    return {
      text: getText(val),
      url: getLink(val),
    }
  }
  if (key === 'category') {
    return isArray(val) ? val.map(getCategory) : getCategory(val)
  }
  if (key === 'enclosure') {
    return getEnclosure(val)
  }
  return val
}
