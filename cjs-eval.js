// cjs-eval.js

const { writeFileSync } = require('fs')

const { read } = require('./dist/cjs/feed-reader.js')

const extractFromUrl = async (url) => {
  try {
    const art = await read(url)
    console.log(art)
    writeFileSync('./output.json', JSON.stringify(art), 'utf8')
  } catch (err) {
    console.trace(err)
  }
}

const init = (argv) => {
  if (argv.length === 3) {
    return extractFromUrl(argv[2])
  }
  return 'Nothing to do!'
}

init(process.argv)
