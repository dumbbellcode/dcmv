export function isUrl(url: string): boolean {
  return URL.canParse(url);
}
