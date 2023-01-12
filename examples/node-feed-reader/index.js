import express from 'express'
import { read } from '@extractus/feed-extractor'

const app = express()

const meta = {
  service: 'feed-reader',
  lang: 'javascript',
  server: 'express',
  platform: 'node',
}

app.get('/', async (req, res) => {
  const url = req.query.url
  if (!url) {
    return res.json(meta)
  }

  const {
    includeEntryContent = 'n',
    includeOptionalElements = 'n',
    useISODateFormat = 'y',
    normalization = 'y',
  } = req.query

  const opts = {
    includeEntryContent: includeEntryContent === 'y',
    includeOptionalElements: includeOptionalElements === 'y',
    useISODateFormat: useISODateFormat !== 'n',
    normalization: normalization !== 'n',
  }

  try {
    const data = await read(url, opts)
    return res.json({
      error: 0,
      message: 'feed data has been extracted successfully',
      data,
      meta,
    })
  } catch (err) {
    return res.json({
      error: 1,
      message: err.message,
      data: null,
      meta,
    })
  }
})

app.listen(3103, () => {
  console.log('Server is running at http://localhost:3103')
})
