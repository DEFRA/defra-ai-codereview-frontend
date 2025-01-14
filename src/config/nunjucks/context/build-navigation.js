/**
 * @param {Partial<Request> | null} request
 */
export function buildNavigation(request) {
  return [
    {
      text: 'Generate code review',
      url: '/',
      isActive: request?.path === '/'
    },
    {
      text: 'View code reviews',
      url: '/code-reviews',
      isActive: request?.path?.startsWith('/code-reviews')
    }
  ]
}

/**
 * @import { Request } from '@hapi/hapi'
 */
