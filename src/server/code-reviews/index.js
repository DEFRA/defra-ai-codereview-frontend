import { getCodeReviews } from './controller.js'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const codeReviews = {
  plugin: {
    name: 'code-reviews',
    register: (server) => {
      server.route({
        method: 'GET',
        path: '/code-reviews',
        handler: getCodeReviews,
        options: {
          auth: false,
          description: 'Code reviews list page',
          tags: ['api', 'code-reviews']
        }
      })
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
