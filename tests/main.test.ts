// main.test.ts

import { assertEquals, assertRejects } from "@std/assert";

import { extract, extractFromJson, extractFromXml } from "../src/main.ts";
import { isValid as isValidUrl } from "../src/utils/linker.ts";
import { createMockFetcher } from "./helpers.ts";

const feedAttrs = "title link description generator language published entries"
  .split(" ");
const entryAttrs = "title link description published id".split(" ");

const isValidDate = (d: string) => !isNaN(Date.parse(d));

const hasProperty = (obj: unknown, key: string) =>
  key in (obj as Record<string, unknown>);

const validateProps = (entry: Record<string, unknown>) => {
  const { id, link, title, published, description } = entry;
  return typeof description === "string" &&
    typeof id === "string" && id !== "" &&
    typeof title === "string" && title !== "" &&
    typeof link === "string" && isValidUrl(link) &&
    typeof published === "string" && isValidDate(published);
};

Deno.test("extract - non-string link", async () => {
  await assertRejects(
    async () => await extract([] as unknown as string),
    Error,
    "Input param must be a valid URL",
  );
});

Deno.test("extractFromXml - invalid xml", () => {
  const xml = '<?xml version="1.0" encoding="UTF-8><noop><oops></ooops>';
  try {
    extractFromXml(xml);
    throw new Error("Should have thrown");
  } catch (e) {
    assertEquals((e as Error).message, "The XML document is not well-formed");
  }
});

Deno.test("extractFromXml - standard rss", () => {
  const xml = Deno.readTextFileSync("tests/test-data/rss-feed-standard-realworld.xml");
  const result = extractFromXml(xml);
  feedAttrs.forEach((k) => {
    assertEquals(hasProperty(result, k), true);
  });
  entryAttrs.forEach((k) => {
    assertEquals(hasProperty(result.entries![0], k), true);
  });
  assertEquals(
    validateProps(result.entries![0] as Record<string, unknown>),
    true,
  );
});

Deno.test("extractFromXml - standard atom", () => {
  const xml = Deno.readTextFileSync(
    "tests/test-data/atom-feed-standard-realworld.xml",
  );
  const result = extractFromXml(xml);
  feedAttrs.forEach((k) => {
    assertEquals(hasProperty(result, k), true);
  });
  entryAttrs.forEach((k) => {
    assertEquals(hasProperty(result.entries![0], k), true);
  });
  assertEquals(
    validateProps(result.entries![0] as Record<string, unknown>),
    true,
  );
});

Deno.test("extractFromXml - atom with extraFields", () => {
  const xml = Deno.readTextFileSync(
    "tests/test-data/atom-feed-standard-realworld.xml",
  );
  const result = extractFromXml(xml, {
    getExtraFeedFields: (data) => {
      return {
        author: (data as Record<string, unknown>).author,
      };
    },
    getExtraEntryFields: (data) => {
      return {
        id: (data as Record<string, unknown>).id,
      };
    },
  });
  assertEquals(hasProperty(result, "author"), true);
  assertEquals(hasProperty(result.entries![0], "id"), true);
  assertEquals(
    validateProps(result.entries![0] as Record<string, unknown>),
    true,
  );
});

Deno.test("extractFromXml - rdf with extraFields", () => {
  const xml = Deno.readTextFileSync("tests/test-data/rdf-standard.xml");
  const result = extractFromXml(xml, {
    getExtraFeedFields: (data) => {
      return {
        subject: (data as Record<string, unknown>)["dc:subject"],
      };
    },
    getExtraEntryFields: (data) => {
      return {
        author: (data as Record<string, unknown>)["dc:creator"],
      };
    },
  });
  assertEquals(hasProperty(result, "subject"), true);
  assertEquals(hasProperty(result.entries![0], "author"), true);
  assertEquals(
    validateProps(result.entries![0] as Record<string, unknown>),
    true,
  );
});

Deno.test("extractFromXml - atom with multi links", () => {
  const xml = Deno.readTextFileSync("tests/test-data/atom-multilinks.xml");
  const result = extractFromXml(xml);
  feedAttrs.forEach((k) => {
    assertEquals(hasProperty(result, k), true);
  });
  entryAttrs.forEach((k) => {
    assertEquals(hasProperty(result.entries![0], k), true);
  });
  assertEquals(
    validateProps(result.entries![0] as Record<string, unknown>),
    true,
  );
});

Deno.test("extractFromJson - standard json feed", () => {
  const json = Deno.readTextFileSync(
    "tests/test-data/json-feed-standard-realworld.json",
  );
  const result = extractFromJson(JSON.parse(json));
  feedAttrs.forEach((k) => {
    assertEquals(hasProperty(result, k), true);
  });
  entryAttrs.forEach((k) => {
    assertEquals(hasProperty(result.entries![0], k), true);
  });
  assertEquals(
    validateProps(result.entries![0] as Record<string, unknown>),
    true,
  );
});

Deno.test("extractFromJson - json feed with extra fields", () => {
  const json = Deno.readTextFileSync(
    "tests/test-data/json-feed-standard-realworld.json",
  );
  const result = extractFromJson(JSON.parse(json), {
    getExtraFeedFields: (data) => {
      return {
        icon: (data as Record<string, unknown>).icon,
      };
    },
    getExtraEntryFields: (data) => {
      return {
        id: (data as Record<string, unknown>).id,
      };
    },
  });
  assertEquals(hasProperty(result, "icon"), true);
  assertEquals(hasProperty(result.entries![0], "id"), true);
  assertEquals(
    validateProps(result.entries![0] as Record<string, unknown>),
    true,
  );
});

Deno.test("extractFromXml - rss feed no link", () => {
  const xml = Deno.readTextFileSync("tests/test-data/rss-feed-miss-link.xml");
  const result = extractFromXml(xml);
  feedAttrs.forEach((k) => {
    assertEquals(hasProperty(result, k), true);
  });
  entryAttrs.forEach((k) => {
    assertEquals(hasProperty(result.entries![0], k), true);
  });
  assertEquals(
    validateProps(result.entries![0] as Record<string, unknown>),
    true,
  );
});

Deno.test("extractFromXml - rss feed with content:encoded", () => {
  const xml = Deno.readTextFileSync("tests/test-data/medium-feed.xml");
  const result = extractFromXml(xml);
  feedAttrs.forEach((k) => {
    assertEquals(hasProperty(result, k), true);
  });
  entryAttrs.forEach((k) => {
    assertEquals(hasProperty(result.entries![0], k), true);
  });
  assertEquals(
    validateProps(result.entries![0] as Record<string, unknown>),
    true,
  );
});

Deno.test("extract - rss feed with useISODateFormat false", async () => {
  const xml = Deno.readTextFileSync("tests/test-data/rss-feed-standard-realworld.xml");
  const fetcher = createMockFetcher(xml, "application/xml");
  const result = await extract("https://some-news-page.tld/rss", {
    useISODateFormat: false,
  }, fetcher);
  assertEquals(result.published, "Thu, 28 Jul 2022 03:39:57 GMT");
  assertEquals(result.entries![0].published, "Thu, 28 Jul 2022 02:43:00 GMT");
});

Deno.test("extract - rss feed with useISODateFormat true", async () => {
  const xml = Deno.readTextFileSync("tests/test-data/rss-feed-standard-realworld.xml");
  const fetcher = createMockFetcher(xml, "application/xml");
  const result = await extract("https://some-news-page.tld/rss", {
    useISODateFormat: true,
  }, fetcher);
  assertEquals(result.published, "2022-07-28T03:39:57.000Z");
  assertEquals(result.entries![0].published, "2022-07-28T02:43:00.000Z");
});

Deno.test("extractFromXml - rss without normalization", () => {
  const xml = Deno.readTextFileSync("tests/test-data/rss-feed-standard-realworld.xml");
  const result = extractFromXml(xml, {
    normalization: false,
  });
  assertEquals(hasProperty(result, "webMaster"), true);
  assertEquals(hasProperty(result, "item"), true);
  const items = result.item as Record<string, unknown>[];
  assertEquals(hasProperty(items[0], "source"), true);
});

Deno.test("extractFromXml - rdf without normalization", () => {
  const xml = Deno.readTextFileSync("tests/test-data/rdf-standard.xml");
  const result = extractFromXml(xml, {
    normalization: false,
  });
  assertEquals(
    hasProperty(
      (result as Record<string, unknown>).channel as Record<string, unknown>,
      "syn:updateBase",
    ),
    true,
  );
  assertEquals(
    hasProperty(
      (result as Record<string, unknown>).channel as Record<string, unknown>,
      "dc:rights",
    ),
    true,
  );
  assertEquals(hasProperty(result, "item"), true);
});

Deno.test("extractFromXml - atom without normalization", () => {
  const xml = Deno.readTextFileSync(
    "tests/test-data/atom-feed-standard-realworld.xml",
  );
  const result = extractFromXml(xml, {
    normalization: false,
  });
  assertEquals(hasProperty(result, "id"), true);
  assertEquals(hasProperty(result, "rights"), true);
  assertEquals(hasProperty(result, "entry"), true);
});

Deno.test("extractFromJson - json feed without normalization", () => {
  const json = Deno.readTextFileSync(
    "tests/test-data/json-feed-standard-realworld.json",
  );
  const result = extractFromJson(JSON.parse(json), {
    normalization: false,
  });
  assertEquals(hasProperty(result, "icon"), true);
  assertEquals(hasProperty(result, "favicon"), true);
  assertEquals(hasProperty(result, "items"), true);
});

Deno.test("extractFromXml - rss podcast feed with enclosure", () => {
  const xml = Deno.readTextFileSync("tests/test-data/podcast.rss");
  const result = extractFromXml(xml, {
    normalization: false,
  });
  assertEquals(hasProperty(result, "itunes:owner"), true);
});

Deno.test("extractFromXml - rss with baseUrl", () => {
  const baseUrl = "https://huggingface.co";
  const xml = Deno.readTextFileSync("tests/test-data/rss-feed-miss-base-url.xml");
  const result = extractFromXml(xml, { baseUrl });

  feedAttrs.forEach((k) => {
    assertEquals(hasProperty(result, k), true);
  });

  entryAttrs.forEach((k) => {
    assertEquals(hasProperty(result.entries![0], k), true);
  });

  assertEquals(
    validateProps(result.entries![0] as Record<string, unknown>),
    true,
  );
  assertEquals(result.link, baseUrl + "/blog");
  assertEquals(result.entries![0].link, baseUrl + "/blog/intro-graphml");
});

Deno.test("extractFromXml - rdf with baseUrl", () => {
  const baseUrl = "https://slashdot.org";
  const xml = Deno.readTextFileSync("tests/test-data/rdf-standard.xml");
  const result = extractFromXml(xml, { baseUrl });

  feedAttrs.forEach((k) => {
    assertEquals(hasProperty(result, k), true);
  });

  entryAttrs.forEach((k) => {
    assertEquals(hasProperty(result.entries![0], k), true);
  });

  assertEquals(
    validateProps(result.entries![0] as Record<string, unknown>),
    true,
  );
  assertEquals(result.link, baseUrl + "/");
});

Deno.test("extractFromJson - json feed with baseUrl", () => {
  const baseUrl = "https://www.jsonfeed.org";
  const json = Deno.readTextFileSync("tests/test-data/json-feed-miss-base-url.json");
  const result = extractFromJson(JSON.parse(json), { baseUrl });

  feedAttrs.forEach((k) => {
    assertEquals(hasProperty(result, k), true);
  });

  entryAttrs.forEach((k) => {
    assertEquals(hasProperty(result.entries![0], k), true);
  });

  assertEquals(result.link, baseUrl + "/");
  assertEquals(
    result.entries![0].link,
    baseUrl + "/2020/08/07/json-feed-version.html",
  );
});
