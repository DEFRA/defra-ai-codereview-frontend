import { getFirstHeader } from './get-first-header.js'

describe('getFirstHeader', () => {
  it('should extract first header from markdown text', () => {
    const text = '# Main Header\n\nSome content\n## Second Header'
    expect(getFirstHeader(text)).toBe('Main Header')
  })

  it('should handle text with no headers', () => {
    const text = 'First line\nSecond line'
    expect(getFirstHeader(text)).toBe('First line')
  })

  it('should handle empty text', () => {
    expect(getFirstHeader('')).toBe('')
  })

  it('should handle text with only header', () => {
    expect(getFirstHeader('# Single Header')).toBe('Single Header')
  })

  it('should handle different header levels', () => {
    expect(getFirstHeader('### Third Level Header')).toBe('Third Level Header')
  })
})
