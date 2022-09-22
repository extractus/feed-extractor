// server

import got from 'got'
import express from 'express'

const app = express()

const loadRemoteFeed = async (url) => {
  try {
    const headers = {
      'Accept-Charset': 'utf-8'
    }
    const data = await got(url, { headers }).text()
    return data
  } catch (err) {
    return err.message
  }
}

app.get('/proxy/getxml', async (req, res) => {
  const url = req.query.url
  const xml = await loadRemoteFeed(url)
  return res.type('text/xml').send(xml)
})

app.use(express.static('public'))

app.listen(3103, () => {
  console.log('Server is running at http://localhost:3103')
})
