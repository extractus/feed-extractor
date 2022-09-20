// eval.js

// import { writeFileSync } from 'fs'

import parseArgs from 'args-parser'

import { read } from './src/main.js'

const extractFromUrl = async (url, options) => {
  try {
    const feed = await read(url, options)
    console.log(feed)
    // writeFileSync('output.json', JSON.stringify(feed, undefined, 2), 'utf8')
  } catch (err) {
    console.log(err)
  }
}

const init = (argv) => {
  const {
    url,
    normalization = 'y',
    includeEntryContent = 'n',
    includeOptionalElements = 'n',
    useISODateFormat = 'y'
  } = parseArgs(argv)

  const options = {
    includeEntryContent: includeEntryContent === 'y',
    includeOptionalElements: includeOptionalElements === 'y',
    useISODateFormat: useISODateFormat !== 'n',
    normalization: normalization !== 'n'
  }
  return url ? extractFromUrl(url, options) : false
}

init(process.argv)
