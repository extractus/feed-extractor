import { serve } from 'https://deno.land/std/http/server.ts'

import { Hono } from 'https://deno.land/x/hono@v3.2.7/mod.ts'

import { extract } from 'npm:@extractus/feed-extractor'

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
  const useISODateFormat = c.req.query('useISODateFormat') || 'y'
  const normalization = c.req.query('normalization') || 'y'

  const opts = {
    useISODateFormat: useISODateFormat !== 'n',
    normalization: normalization !== 'n'
  }

  try {
    const data = await extract(url, opts)
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
