function warnCjsUsage () {
  if (process.env.FEED_EXTRACTOR_CJS_IGNORE_WARNING?.toLowerCase() === 'true') return
  const yellow = (str) => `\u001b[33m${str}\u001b[39m`
  const log = process.env.FEED_EXTRACTOR_CJS_TRACE_WARNING?.toLowerCase() === 'true' ? console.trace : console.warn
  log(
    yellow(
      'The CJS build of @extractus/feed-extractor is deprecated. See https://github.com/extractus/feed-extractor#cjs-deprecated for details.'
    )
  )
}

warnCjsUsage()

export * from './main'
