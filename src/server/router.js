import inert from '@hapi/inert'

import { health } from '~/src/server/health/index.js'
import { home } from '~/src/server/home/index.js'
import { codeReviews } from '~/src/server/code-reviews/index.js'
import { standards } from '~/src/server/standards/index.js'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files.js'

/**
 * Router plugin
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const router = {
  plugin: {
    name: 'router',
    async register(server) {
      await server.register([inert])

      // Enable method override for DELETE/PUT/PATCH methods
      await server.register({
        plugin: {
          name: 'method-override',
          register: function (server) {
            server.ext('onRequest', (request, h) => {
              if (request.method === 'post') {
                const method = request.payload?._method?.toUpperCase()
                if (method && ['PUT', 'PATCH', 'DELETE'].includes(method)) {
                  request.method = method
                }
              }
              return h.continue
            })
          }
        },
        options: {
          methods: ['POST', 'GET'],
          parameter: '_method'
        }
      })

      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Application specific routes, add your own routes here
      await server.register([home, codeReviews, standards])

      // Static assets
      await server.register([serveStaticFiles])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
