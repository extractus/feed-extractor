// eval.js

import { readFileSync, writeFileSync, existsSync } from 'fs'

import isValidUrl from './src/utils/isValidUrl.js'
import { read } from './src/main.js'

const extractFromUrl = async (url) => {
  try {
    const art = await read(url)
    console.log(art)
    writeFileSync('./output.json', JSON.stringify(art), 'utf8')
  } catch (err) {
    console.trace(err)
  }
}

const extractFromFile = async (fpath) => {
  try {
    const xml = readFileSync(fpath, 'utf8')
    const art = await read(xml)
    console.log(art)
    writeFileSync('./output.json', JSON.stringify(art), 'utf8')
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
