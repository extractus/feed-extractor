// xmlparser.test

import { describe, it } from 'node:test'
import assert from 'node:assert'
import { readFileSync } from 'node:fs'

import { isObject } from '@pwshub/bellajs'

import { validate, isRSS, isAtom, xml2obj } from './xmlparser.js'

describe('test methods from `xmlparser`', () => {
  it('test validate(well format xml)', async () => {
    const xmlData = '<xml><atag id="12">value</atag></xml>'
    const result = validate(xmlData)
    assert.ok(result)
  })

  it('test validate(bad format xml)', async () => {
    const xmlData = '<xml><atag id="12">value</btag></xml>'
    const result = validate(xmlData)
    assert.ok(!result)
  })

  it('test validate(standard rss content)', async () => {
    const xml = readFileSync('test-data/rss-feed-standard.xml', 'utf8')
    const xmlData = xml2obj(xml)
    assert.ok(isRSS(xmlData))
    assert.ok(!isAtom(xmlData))
  })

  it('test validate(standard atom content)', async () => {
    const xml = readFileSync('test-data/atom-feed-standard.xml', 'utf8')
    const xmlData = xml2obj(xml)
    assert.ok(isAtom(xmlData))
    assert.ok(!isRSS(xmlData))
  })

  it('test xml2obj(well format xml)', async () => {
    const xmlData = '<xml><atag id="12">value</atag></xml>'
    const result = xml2obj(xmlData)
    assert.ok(isObject(result))
    assert.ok(isObject(result.xml))
  })
})
