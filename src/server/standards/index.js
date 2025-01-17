import {
  getStandardsHome,
  getClassifications,
  createClassification,
  deleteClassification
} from './controller.js'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const standards = {
  plugin: {
    name: 'standards',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/standards',
          handler: getStandardsHome,
          options: {
            auth: false,
            description: 'Standards management landing page',
            tags: ['api', 'standards']
          }
        },
        {
          method: 'GET',
          path: '/standards/classifications',
          handler: getClassifications,
          options: {
            auth: false,
            description: 'Classifications management page',
            tags: ['api', 'standards']
          }
        },
        {
          method: 'POST',
          path: '/standards/classifications/create',
          handler: createClassification,
          options: {
            auth: false,
            description: 'Create a new classification',
            tags: ['api', 'standards']
          }
        },
        {
          method: 'POST',
          path: '/standards/classifications/{id}/delete',
          handler: deleteClassification,
          options: {
            auth: false,
            description: 'Delete a classification',
            tags: ['api', 'standards']
          }
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
