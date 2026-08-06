# feed-extractor

To read & normalize RSS/ATOM/JSON feed data.

[![JSR](https://jsr.io/badges/@extractus/feed-extractor)](https://jsr.io/@extractus/feed-extractor)
[![npm version](https://badge.fury.io/js/@extractus%2Ffeed-extractor.svg)](https://badge.fury.io/js/@extractus%2Ffeed-extractor)
![CI test](https://github.com/extractus/feed-extractor/workflows/ci-test/badge.svg)

## Installation

### Deno

```bash
deno add jsr:@extractus/feed-extractor
```

### Node.js / Bun

```bash
pnpm add jsr:@extractus/feed-extractor
# or
npx jsr add @extractus/feed-extractor
# or
bunx jsr add @extractus/feed-extractor
```

Alternatively, install from npm:

```bash
npm install @extractus/feed-extractor
# or
bun add @extractus/feed-extractor
```

## Usage

```ts
import { extract } from "@extractus/feed-extractor";

const data = await extract("https://news.google.com/atom");
console.log(data);
```

## APIs

- [`extract()`](#extract)
- [`extractFromJson()`](#extractfromjson)
- [`extractFromXml()`](#extractfromxml)

---

### `extract()`

Load and extract feed data from given RSS/ATOM/JSON source.

#### Syntax

```ts
extract(url: string): Promise<FeedData>
extract(url: string, options?: ParserOptions): Promise<FeedData>
extract(url: string, options?: ParserOptions, fetcher?: Fetcher): Promise<FeedData>
```

Example:

```ts
import { extract } from "@extractus/feed-extractor";

const result = await extract("https://news.google.com/atom");
console.log(result);
```

Without any options, the result should have the following structure:

```ts
{
  title: string;
  link: string;
  description: string;
  generator: string;
  language: string;
  published: string; // ISO datetime
  entries: Array<{
    id: string;
    title: string;
    link: string;
    description: string;
    published: string; // ISO datetime
  }>;
}
```

#### Parameters

##### `url` *required*

URL of a valid feed source.

Feed content must be accessible and conform to one of the following standards:

- [RSS Feed](https://www.rssboard.org/rss-specification)
  - [RDF Feed](https://web.resource.org/rss/1.0/spec)
- [ATOM Feed](https://datatracker.ietf.org/doc/html/rfc5023)
- [JSON Feed](https://www.jsonfeed.org/version/1.1/)

##### `options` *optional*

Object with all or several of the following properties:

- `normalization`: boolean, normalize feed data or keep original. Default `true`.
- `useISODateFormat`: boolean, convert datetime to ISO format. Default `true`.
- `descriptionMaxLen`: number, to truncate description. Default `250` characters. Set to `0` = no truncation.
- `xmlParserOptions`: object, options passed to the XML parser.
- `getExtraFeedFields`: function, to get more fields from feed data.
- `getExtraEntryFields`: function, to get more fields from feed entry data.
- `baseUrl`: URL string, to absolutify the links within feed content.

For example:

```ts
import { extract } from "@extractus/feed-extractor";

await extract("https://news.google.com/atom", {
  useISODateFormat: false,
});

await extract("https://news.google.com/rss", {
  useISODateFormat: false,
  getExtraFeedFields: (feedData) => {
    return {
      subtitle: feedData.subtitle || "",
    };
  },
  getExtraEntryFields: (feedEntry) => {
    const { enclosure, category } = feedEntry;
    return {
      enclosure: {
        url: enclosure["@_url"],
        type: enclosure["@_type"],
        length: enclosure["@_length"],
      },
    };
  },
});
```

##### `fetcher` *optional*

A custom fetch function with the signature `(url: string) => Promise<Response>`.
Use this to customize HTTP behavior: proxy, headers, TLS, authentication, timeouts, etc.

Defaults to `globalThis.fetch`.

**Deno** (with proxy):

```ts
import { extract } from "@extractus/feed-extractor";

const client = Deno.createHttpClient({
  proxy: { url: "http://proxy.example.com:8080" },
});
const myFetcher = (url: string) => fetch(url, { client });

const result = await extract("https://news.google.com/rss", {}, myFetcher);
```

**Node.js** (with proxy via undici):

```ts
import { extract } from "@extractus/feed-extractor";
import { fetch, ProxyAgent } from "undici";

const dispatcher = new ProxyAgent("http://proxy.example.com:8080");
const myFetcher = (url: string) => fetch(url, { dispatcher });

const result = await extract("https://news.google.com/rss", {}, myFetcher);
```

**Bun** (with proxy):

```ts
import { extract } from "@extractus/feed-extractor";

const myFetcher = (url: string) =>
  fetch(url, {
    proxy: "http://proxy.example.com:8080",
  });

const result = await extract("https://news.google.com/rss", {}, myFetcher);
```

**Custom headers**:

```ts
const myFetcher = (url: string) =>
  fetch(url, {
    headers: {
      "user-agent": "MyBot/1.0",
      authorization: "Bearer token123",
    },
  });

const result = await extract(url, {}, myFetcher);
```

**Request timeout**:

```ts
const myFetcher = (url: string) =>
  fetch(url, {
    signal: AbortSignal.timeout(5000),
  });

const result = await extract(url, {}, myFetcher);
```

---

### `extractFromJson()`

Extract feed data from a JSON object or string.

#### Syntax

```ts
extractFromJson(json: Record<string, unknown> | string): FeedData
extractFromJson(json: Record<string, unknown> | string, options?: ParserOptions): FeedData
```

Example:

```ts
import { extractFromJson } from "@extractus/feed-extractor";

const url = "https://www.jsonfeed.org/feed.json";
const res = await fetch(url);
const json = await res.json();

const feed = extractFromJson(json);
console.log(feed);
```

#### Parameters

##### `json` *required*

JSON object or string from a JSON Feed resource.

##### `options` *optional*

See [options](#options-optional) above.

---

### `extractFromXml()`

Extract feed data from an XML string.

#### Syntax

```ts
extractFromXml(xml: string): FeedData
extractFromXml(xml: string, options?: ParserOptions): FeedData
```

Example:

```ts
import { extractFromXml } from "@extractus/feed-extractor";

const url = "https://news.google.com/atom";
const res = await fetch(url);
const xml = await res.text();

const feed = extractFromXml(xml);
console.log(feed);
```

#### Parameters

##### `xml` *required*

XML string from an RSS/ATOM feed resource.

##### `options` *optional*

See [options](#options-optional) above.

---

## Development

```bash
git clone https://github.com/extractus/feed-extractor.git
cd feed-extractor

# Run tests
deno test --allow-all

# Lint
deno lint

# Build npm package
deno task build
```

## License

The MIT License (MIT)

## Support the project

This project is maintained in my spare time. If you find it helpful, there are a few simple ways to support its continued development:

* ⭐ Star this repository to help more people discover it.
* ☕ Buy me a coffee: https://paypal.me/ndaidong
* 🚀 Subscribe to the [Feed Reader service](https://rapidapi.com/pwshub-pwshub-default/api/feed-reader1/) on RapidAPI.

Every bit of support helps keep this project actively maintained. Thank you! ❤️

---
