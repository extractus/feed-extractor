import { Hono } from 'hono'

import { read } from '@extractus/feed-extractor'

const app = new Hono()

const meta = {
  service: 'feed-reader',
  lang: 'typescript',
  server: 'hono',
  platform: 'bun'
}

app.get('/', async (c) => {
  const url = c.req.query('url')
  if (!url) {
    return c.json(meta)
  }
  const includeEntryContent = c.req.query('includeEntryContent') || 'n'
  const includeOptionalElements = c.req.query('includeOptionalElements') || 'n'
  const useISODateFormat = c.req.query('useISODateFormat') || 'y'
  const normalization = c.req.query('normalization') || 'y'

  const opts = {
    includeEntryContent: includeEntryContent === 'y',
    includeOptionalElements: includeOptionalElements === 'y',
    useISODateFormat: useISODateFormat !== 'n',
    normalization: normalization !== 'n'
  }

  try {
    const data = await read(url, opts)
    return c.json({
      error: 0,
      message: 'feed data has been extracted successfully',
      data,
      meta
    })
  } catch (err) {
    return c.json({
      error: 1,
      message: err.message,
      data: null,
      meta
    })
  }
})

export default {
  port: 3103,
  fetch: app.fetch,
}

console.log('Server is running at http://localhost:3103')
