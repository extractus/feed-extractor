// configs

const { clone } = require('bellajs')

const { name, version } = require('../package.json')

const fetchOptions = {
  headers: {
    'user-agent': `${name}/${version}`
  },
  timeout: 30 * 1e3,
  redirect: 'follow'
}

const sanitizeHtmlOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5',
    'u', 'b', 'i', 'em', 'strong',
    'div', 'span', 'p', 'article', 'blockquote', 'section',
    'pre', 'code',
    'ul', 'ol', 'li', 'dd', 'dl',
    'table', 'th', 'tr', 'td', 'thead', 'tbody', 'tfood',
    'label',
    'fieldset', 'legend',
    'img', 'picture',
    'br', 'p', 'hr',
    'a'
  ],
  allowedAttributes: {
    a: ['href'],
    img: ['src', 'alt']
  }
}

module.exports = {
  getFetchOptions: () => {
    return clone(fetchOptions)
  },
  getSanitizeHtmlOptions: () => {
    return clone(sanitizeHtmlOptions)
  }
}
