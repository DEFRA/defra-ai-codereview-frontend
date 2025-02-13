import { marked } from 'marked'

export { formatDate } from '~/src/config/nunjucks/filters/format-date.js'
export { formatCurrency } from '~/src/config/nunjucks/filters/format-currency.js'
export { markdown } from '~/src/config/nunjucks/filters/markdown.js'

/**
 * Extract the first header from markdown text
 * @param {string} text - The markdown text to parse
 * @returns {string} The text content of the first header found, or the first line if no header is found
 */
export function extractFirstHeader(text) {
  if (!text) return ''

  const tokens = marked.lexer(text)
  const firstHeader = tokens.find((token) => token.type === 'heading')

  if (firstHeader) {
    return firstHeader.text
  }

  // If no header found, return first line or empty string
  const firstLine = text.split('\n')[0]
  return firstLine || ''
}
