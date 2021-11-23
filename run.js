const { readFileSync, existsSync } = require('fs')

const isValidUrl = require('./src/utils/isValidUrl')
const { parse } = require('./index')

const extractFromUrl = async (url) => {
  try {
    const art = await parse(url)
    console.log(art)
  } catch (err) {
    console.trace(err)
  }
}

const extractFromFile = async (fpath) => {
  try {
    const xml = readFileSync(fpath, 'utf8')
    const art = await parse(xml)
    console.log(art)
  } catch (err) {
    console.trace(err)
  }
}

const init = (argv) => {
  if (argv.length === 3) {
    const input = argv[2]
    const isUrl = isValidUrl(input)
    return isUrl ? extractFromUrl(input) : existsSync(input) ? extractFromFile(input) : false
  }
  return 'Nothing to do!'
}

init(process.argv)
