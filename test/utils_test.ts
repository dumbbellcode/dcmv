import { isUrl, isLocalhostUrl, extractServiceName } from "../src/utils.ts";

// test isUrl
console.log(isUrl("scheme://username:password@host:1234/path?query#fragment"));
console.log(isUrl("https://service_b:80/api"));
console.log(isUrl("ftp://service_c:21/api"));

// test isLocalhostUrl
console.log(isLocalhostUrl("http://localhost:3000/api"));
console.log(isLocalhostUrl("https://localhost:80/api"));

// test extractServiceName
console.log(extractServiceName("http://service_a:3000/api"));
console.log(extractServiceName("https://service_b:80/api"));