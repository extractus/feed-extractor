// normalizer.test.ts

import { assertEquals } from "@std/assert";
import { getLink, toISODateString } from "../src/utils/normalizer.ts";

Deno.test("toISODateString - convert dates to ISO format", () => {
  assertEquals(
    toISODateString("Thu, 28 Jul 2022 08:59:58 GMT"),
    "2022-07-28T08:59:58.000Z",
  );
  assertEquals(
    toISODateString("2022-07-28T02:43:00.000000000Z"),
    "2022-07-28T02:43:00.000Z",
  );
  assertEquals(toISODateString(""), "");
  assertEquals(toISODateString("Thi, 280 Jul 2022 108:79:68 XMT"), "");
});

Deno.test("getLink - prefers rel=alternate among multiple links", () => {
  assertEquals(
    getLink([
      { "@_rel": "self", "@_href": "https://example.org/feed.atom" },
      { "@_rel": "alternate", "@_href": "https://example.org/" },
    ]),
    "https://example.org/",
  );
  // a link without rel is an alternate link too (RFC 4287)
  assertEquals(
    getLink([
      { "@_rel": "enclosure", "@_href": "https://example.org/ep1.mp3" },
      { "@_href": "https://example.org/posts/ep1" },
    ]),
    "https://example.org/posts/ep1",
  );
  assertEquals(
    getLink([
      { "@_rel": "related", "@_href": "https://example.org/related" },
      { "@_rel": "alternate", "@_href": "https://example.org/posts/ep2" },
    ]),
    "https://example.org/posts/ep2",
  );
  // rel provided as a plain attribute or under _attributes
  assertEquals(
    getLink([
      { rel: "self", href: "https://example.org/feed.atom" },
      { rel: "alternate", href: "https://example.org/" },
    ]),
    "https://example.org/",
  );
  assertEquals(
    getLink([
      {
        _attributes: { rel: "edit", href: "https://example.org/edit" },
      },
      {
        _attributes: { rel: "alternate", href: "https://example.org/post" },
      },
    ]),
    "https://example.org/post",
  );
});

Deno.test("getLink - falls back to the first link", () => {
  // no alternate link at all -> keep the first link, never an empty value
  assertEquals(
    getLink([
      { "@_rel": "self", "@_href": "https://example.org/feed.atom" },
      { "@_rel": "hub", "@_href": "https://example.org/hub" },
    ]),
    "https://example.org/feed.atom",
  );
  // extension relation IRIs are not alternate links
  assertEquals(
    getLink([
      { "@_rel": "http://example.org/rels/via", "@_href": "https://a.org/1" },
      { "@_rel": "via", "@_href": "https://a.org/2" },
    ]),
    "https://a.org/1",
  );
  // plain strings (RSS-style arrays) keep their order
  assertEquals(
    getLink(["https://example.org/a", "https://example.org/b"]),
    "https://example.org/a",
  );
  assertEquals(getLink([]), "");
});

Deno.test("getLink - single link object is not filtered by rel", () => {
  assertEquals(
    getLink({ "@_rel": "self", "@_href": "https://example.org/feed.atom" }),
    "https://example.org/feed.atom",
  );
});
