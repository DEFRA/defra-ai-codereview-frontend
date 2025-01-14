import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation.js'

/**
 * @param {Partial<Request>} [options]
 */
function mockRequest(options) {
  return { ...options }
}

describe('#buildNavigation', () => {
  test('Should provide expected navigation details', () => {
    expect(
      buildNavigation(mockRequest({ path: '/non-existent-path' }))
    ).toEqual([
      {
        isActive: false,
        text: 'Home',
        url: '/'
      },
      {
        isActive: false,
        text: 'Code Reviews',
        url: '/code-reviews'
      }
    ])
  })

  test('Should highlight home page in navigation', () => {
    expect(buildNavigation(mockRequest({ path: '/' }))).toEqual([
      {
        isActive: true,
        text: 'Home',
        url: '/'
      },
      {
        isActive: false,
        text: 'Code Reviews',
        url: '/code-reviews'
      }
    ])
  })

  test('Should highlight code reviews list page in navigation', () => {
    expect(buildNavigation(mockRequest({ path: '/code-reviews' }))).toEqual([
      {
        isActive: false,
        text: 'Home',
        url: '/'
      },
      {
        isActive: true,
        text: 'Code Reviews',
        url: '/code-reviews'
      }
    ])
  })

  test('Should highlight code review detail page in navigation', () => {
    expect(
      buildNavigation(mockRequest({ path: '/code-reviews/123456789' }))
    ).toEqual([
      {
        isActive: false,
        text: 'Home',
        url: '/'
      },
      {
        isActive: true,
        text: 'Code Reviews',
        url: '/code-reviews'
      }
    ])
  })
})

/**
 * @import { Request } from '@hapi/hapi'
 */
