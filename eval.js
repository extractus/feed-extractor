// eval.js
// to quickly test with a single url or file

import { read } from './src/main.js'

const run = async (url) => {
  try {
    const art = await read(url)
    console.log(art)
  } catch (err) {
    console.trace(err)
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
