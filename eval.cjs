// eval.cjs

// to quickly test with a single url or file

const { read } = require('./dist/cjs/feed-reader.js')

const extractFromUrl = async (url) => {
  try {
    const feed = await read(url)
    console.log(feed)
  } catch (err) {
    console.trace(err)
  }
}

const init = (argv) => {
  if (argv.length === 3) {
    const input = argv[2]
    return extractFromUrl(input)
  }
  return 'Nothing to do!'
}

init(process.argv)
