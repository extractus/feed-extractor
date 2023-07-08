// eval.js
// to quickly test with a single url or file

import { read } from './src/main.js'

const run = async (url) => {
  try {
    console.time('extract-feed')
    const feed = await read(url)
    console.log(feed)
    console.timeEnd('extract-feed')
  } catch (err) {
    console.log(err.message)
  }
}

const init = (argv) => {
  if (argv.length === 3) {
    const url = argv[2]
    return run(url)
  }
  return 'Nothing to do!'
}

init(process.argv)
