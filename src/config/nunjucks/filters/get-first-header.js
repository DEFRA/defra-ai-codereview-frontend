/**
 * Get the first header from markdown text
 * @param {string} text - The markdown text to parse
 * @returns {string} The first header text or first line if no header found
 */
export function getFirstHeader(text) {
  const lines = text.split('\n')
  for (const line of lines) {
    const headerMatch = line.match(/^#+\s+(.+)$/)
    if (headerMatch) {
      return headerMatch[1]
    }
  }
  return lines[0] || text
}
