// retrieve.test.ts

import { assertEquals, assertRejects } from "@std/assert";
import retrieve from "../src/utils/retrieve.ts";
import { createMockFetcher } from "./helpers.ts";

Deno.test("retrieve - bad status code", async () => {
  const fetcher = createMockFetcher("Error 500", "text/plain", 500);
  await assertRejects(
    async () => await retrieve("https://some.where/bad/page", fetcher),
    Error,
    "Request failed with error code 500",
  );
});

Deno.test("retrieve - bad content type with non-xml content", async () => {
  const fetcher = createMockFetcher("this is plain text", "something/type");
  await assertRejects(
    async () => await retrieve("https://some.where/bad/page", fetcher),
    Error,
    "Invalid content type: something/type",
  );
});

Deno.test("retrieve - xml content with wrong content type", async () => {
  const fetcher = createMockFetcher(
    '<?xml version="1.0"?><tag>this is xml</tag>',
    "something/type",
  );
  const result = await retrieve("https://some.where/good/page", fetcher);
  assertEquals(result.type, "xml");
  assertEquals(result.text, '<?xml version="1.0"?><tag>this is xml</tag>');
});

Deno.test("retrieve - xml from good source", async () => {
  const fetcher = createMockFetcher(
    "<div>this is content</div>",
    "application/rss+xml",
  );
  const result = await retrieve("https://some.where/good/page", fetcher);
  assertEquals(result.type, "xml");
  assertEquals(result.text, "<div>this is content</div>");
});

Deno.test("retrieve - xml with whitespace around root", async () => {
  const fetcher = createMockFetcher(
    "\n\r\r\n\n<div>this is content</div>\n\r\r\n\n",
    "text/xml",
  );
  const result = await retrieve("https://some.where/good/page", fetcher);
  assertEquals(result.type, "xml");
  assertEquals(result.text, "<div>this is content</div>");
});

Deno.test("retrieve - json from good source", async () => {
  const jsonBody = JSON.stringify({ title: "test feed", items: [] });
  const fetcher = createMockFetcher(jsonBody, "application/json");
  const result = await retrieve("https://some.where/good/json", fetcher);
  assertEquals(result.type, "json");
  assertEquals((result.json as Record<string, unknown>).title, "test feed");
});

Deno.test("retrieve - custom fetcher (proxy)", async () => {
  const fetcher = () =>
    Promise.resolve(
      new Response('<?xml version="1.0"?><tag>this is xml</tag>', {
        status: 200,
        headers: { "content-type": "text/xml" },
      }),
    );
  const result = await retrieve("https://some.where/good/source", fetcher);
  assertEquals(result.type, "xml");
  assertEquals(result.text, '<?xml version="1.0"?><tag>this is xml</tag>');
});

Deno.test("retrieve - custom headers via fetcher", async () => {
  let capturedUrl = "";
  const fetcher = (url: string) => {
    capturedUrl = url;
    return Promise.resolve(
      new Response("<rss><channel><title>test</title></channel></rss>", {
        status: 200,
        headers: { "content-type": "application/rss+xml" },
      }),
    );
  };
  const result = await retrieve("https://some.where/rss", fetcher);
  assertEquals(result.type, "xml");
  assertEquals(capturedUrl, "https://some.where/rss");
});
