import { serve } from 'https://deno.land/std/http/server.ts'

import { Hono } from 'https://deno.land/x/hono@v2.1.4/mod.ts'
import { read } from 'https://esm.sh/feed-reader@latest'

const app = new Hono()

const meta = {
  service: 'feed-reader',
  lang: 'typescript',
  server: 'hono',
  platform: 'deno'
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

serve(app.fetch, {
  port: 3103,
  onListen: () => {
    console.log('Server is running at http://localhost:3103')
  }
})
