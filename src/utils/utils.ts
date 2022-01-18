export function removeSpecialCharacters(string: string): string {
  return string.replace(/[^a-zA-Z0-9\._\-]+/g, '');
}
