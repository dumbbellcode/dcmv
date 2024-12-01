import { isUrl } from "../../src/utils/url.ts";
import { expect } from "jsr:@std/expect";

Deno.test("isUrl", () => {
  const cases = [
    ["https://service_b:80/api", true],
    ["ftp://service_c:21/api", true],
    ["http://pqr:9000", true],
    ["scheme://username:password@host:1234/path?query#fragment", true],
    ["not a url", false],
    ["", false],
  ];

  for (const [url, expected] of cases) {
    expect(isUrl(url as string)).toBe(expected);
  }
});
