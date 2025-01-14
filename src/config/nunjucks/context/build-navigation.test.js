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

  test('Should provide expected highlighted navigation details', () => {
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
})

/**
 * @import { Request } from '@hapi/hapi'
 */
