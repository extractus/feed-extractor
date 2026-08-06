// normalizer.test.ts

import { assertEquals } from "@std/assert";
import { toISODateString } from "../src/utils/normalizer.ts";

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
