// eval.js

import { writeFileSync } from 'fs'

import { read, onComplete, onSuccess, onError } from './src/main.js'

const extractFromUrl = async (url) => {
  onComplete((result, url) => {
    console.log('onComplete', url)
  })
  onSuccess((feed, url) => {
    console.log('onSuccess', url)
    writeFileSync('./output.json', JSON.stringify(feed, undefined, 2), 'utf8')
  })
  onError((e, url) => {
    console.log('onError', url)
    console.log(e)
  })
  const feed = await read(url)
  console.log(feed)
}

const init = (argv) => {
  if (argv.length === 3) {
    const isUrl = argv[2]
    return isUrl ? extractFromUrl(isUrl) : false
  }
  return 'Nothing to do!'
}

init(process.argv)
