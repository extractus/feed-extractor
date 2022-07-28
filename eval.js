// eval.js

// import { writeFileSync } from 'fs'

import { read } from './src/main.js'

const extractFromUrl = async (url) => {
  try {
    const feed = await read(url)
    console.log(feed)
    // writeFileSync('output.json', JSON.stringify(feed, undefined, 2), 'utf8')
  } catch (err) {
    console.log(err)
  }
}

const init = (argv) => {
  if (argv.length === 3) {
    const isUrl = argv[2]
    return isUrl ? extractFromUrl(isUrl) : false
  }
  return 'Nothing to do!'
}

init(process.argv)
