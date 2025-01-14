/**
 * @param {Partial<Request> | null} request
 */
export function buildNavigation(request) {
  return [
    {
      text: 'Home',
      url: '/',
      isActive: request?.path === '/'
    },
    {
      text: 'Code Reviews',
      url: '/code-reviews',
      isActive: request?.path?.startsWith('/code-reviews')
    }
  ]
}

/**
 * @import { Request } from '@hapi/hapi'
 */
