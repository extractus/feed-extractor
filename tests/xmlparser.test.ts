// xmlparser.test.ts

import { assertEquals } from "@std/assert";
import { isAtom, isRSS, validate, xml2obj } from "../src/utils/xmlparser.ts";

const isObject = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null;

Deno.test("validate - well format xml", () => {
  const xmlData = '<xml><atag id="12">value</atag></xml>';
  const result = validate(xmlData);
  assertEquals(result, true);
});

Deno.test("validate - bad format xml", () => {
  const xmlData = '<xml><atag id="12">value</btag></xml>';
  const result = validate(xmlData);
  assertEquals(result, false);
});

Deno.test("isRSS - standard rss content", () => {
  const xml = Deno.readTextFileSync("tests/test-data/rss-feed-standard.xml");
  const xmlData = xml2obj(xml);
  assertEquals(isRSS(xmlData), true);
  assertEquals(isAtom(xmlData), false);
});

Deno.test("isAtom - standard atom content", () => {
  const xml = Deno.readTextFileSync("tests/test-data/atom-feed-standard.xml");
  const xmlData = xml2obj(xml);
  assertEquals(isAtom(xmlData), true);
  assertEquals(isRSS(xmlData), false);
});

Deno.test("xml2obj - well format xml", () => {
  const xmlData = '<xml><atag id="12">value</atag></xml>';
  const result = xml2obj(xmlData);
  assertEquals(isObject(result), true);
  assertEquals(isObject((result as Record<string, unknown>).xml), true);
});
