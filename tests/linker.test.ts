// linker.test.ts

import { assertEquals } from "@std/assert";
import { absolutify, isValid, purify } from "../src/utils/linker.ts";

Deno.test("isValid - valid URLs", () => {
  assertEquals(isValid("https://www.23hq.com"), true);
  assertEquals(isValid("https://secure.actblue.com"), true);
  assertEquals(
    isValid(
      "https://docs.microsoft.com/en-us/azure/iot-edge/quickstart?view=iotedge-2018-06",
    ),
    true,
  );
  assertEquals(isValid("http://192.168.1.199:8081/example/page"), true);
});

Deno.test("isValid - invalid URLs", () => {
  assertEquals(isValid("ftp://192.168.1.199:8081/example/page"), false);
  assertEquals(isValid(""), false);
  assertEquals(isValid(null as unknown as string), false);
  assertEquals(isValid({ a: "x" } as unknown as string), false);
});

Deno.test("absolutify - resolve relative URLs", () => {
  assertEquals(absolutify("", ""), "");
  assertEquals(absolutify("", {} as unknown as string), "");
  assertEquals(
    absolutify("https://some.where/article/abc-xyz", "category/page.html"),
    "https://some.where/article/category/page.html",
  );
  assertEquals(
    absolutify("https://some.where/article/abc-xyz", "../category/page.html"),
    "https://some.where/category/page.html",
  );
  assertEquals(
    absolutify(
      "https://some.where/blog/authors/article/abc-xyz",
      "/category/page.html",
    ),
    "https://some.where/category/page.html",
  );
  assertEquals(
    absolutify("https://some.where/article/abc-xyz", ""),
    "https://some.where/article/abc-xyz",
  );
});

Deno.test("purify - invalid URLs", () => {
  assertEquals(purify(null), null);
  assertEquals(purify(""), null);
  assertEquals(purify(123), null);
  assertEquals(purify({}), null);
});

Deno.test("purify - remove tracking params", () => {
  assertEquals(
    purify("https://some.where/article/abc-xyz"),
    "https://some.where/article/abc-xyz",
  );
  assertEquals(
    purify("https://some.where/article/abc-xyz#name,bob"),
    "https://some.where/article/abc-xyz",
  );
  assertEquals(
    purify(
      "https://some.where/article/abc-xyz?utm_source=news4&utm_medium=email&utm_campaign=spring-summer",
    ),
    "https://some.where/article/abc-xyz",
  );
  assertEquals(
    purify(
      "https://some.where/article/abc-xyz?q=3&utm_source=news4&utm_medium=email&utm_campaign=spring-summer",
    ),
    "https://some.where/article/abc-xyz?q=3",
  );
  assertEquals(
    purify(
      "https://some.where/article/abc-xyz?pk_source=news4&pk_medium=email&pk_campaign=spring-summer",
    ),
    "https://some.where/article/abc-xyz",
  );
  assertEquals(
    purify(
      "https://some.where/article/abc-xyz?q=3&pk_source=news4&pk_medium=email&pk_campaign=spring-summer",
    ),
    "https://some.where/article/abc-xyz?q=3",
  );
});
