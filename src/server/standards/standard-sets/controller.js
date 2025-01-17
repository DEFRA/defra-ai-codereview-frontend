import { config } from '~/src/config/config.js'
import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation.js'

/**
 * Get all standard sets
 * @param {import('@hapi/hapi').Request} request
 * @param {import('@hapi/hapi').ResponseToolkit} h
 */
export async function getStandardSets(request, h) {
  try {
    const response = await fetch(
      `${config.get('apiBaseUrl')}/api/v1/standard-sets`
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const standardSets = await response.json()

    return h.view('standards/standard-sets/index', {
      pageTitle: 'Manage Standard Sets',
      standardSets,
      navigation: buildNavigation(request)
    })
  } catch (err) {
    request.logger.error('Error fetching standard sets:', err)
    return h.view('error/index', {
      statusCode: 500,
      title: 'Internal Server Error',
      message: 'Unable to fetch standard sets. Please try again later.'
    })
  }
}

/**
 * Show create standard set form
 * @param {import('@hapi/hapi').Request} request
 * @param {import('@hapi/hapi').ResponseToolkit} h
 */
export function showCreateStandardSet(request, h) {
  return h.view('standards/standard-sets/create', {
    pageTitle: 'Add Standard Set',
    navigation: buildNavigation(request)
  })
}

/**
 * Create a new standard set
 * @param {import('@hapi/hapi').Request} request
 * @param {import('@hapi/hapi').ResponseToolkit} h
 */
export async function createStandardSet(request, h) {
  const data = {
    name: request.payload.name,
    repository_url: request.payload.repository_url,
    custom_prompt: request.payload.custom_prompt
  }

  // Validate input
  const errors = {}
  if (!data.name) {
    errors.name = {
      field: 'name',
      message: 'Enter a standard set name'
    }
  }
  if (!data.repository_url) {
    errors.repository_url = {
      field: 'repository_url',
      message: 'Enter a repository URL'
    }
  }

  if (Object.keys(errors).length > 0) {
    return h
      .view('standards/standard-sets/create', {
        pageTitle: 'Add Standard Set',
        navigation: buildNavigation(request),
        errors,
        values: data
      })
      .code(400)
  }

  try {
    const response = await fetch(
      `${config.get('apiBaseUrl')}/api/v1/standard-sets`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    return h.redirect('/standards/standard-sets')
  } catch (err) {
    request.logger.error('Error creating standard set:', err)
    return h.view('standards/standard-sets/create', {
      pageTitle: 'Add Standard Set',
      navigation: buildNavigation(request),
      error: 'Unable to create standard set. Please try again later.',
      values: data
    })
  }
}

/**
 * Delete a standard set
 * @param {import('@hapi/hapi').Request} request
 * @param {import('@hapi/hapi').ResponseToolkit} h
 */
export async function deleteStandardSet(request, h) {
  const { id } = request.params
  try {
    const response = await fetch(
      `${config.get('apiBaseUrl')}/api/v1/standard-sets/${id}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    return h.redirect('/standards/standard-sets')
  } catch (err) {
    request.logger.error('Error deleting standard set:', err)
    return h.view('error/index', {
      statusCode: 500,
      title: 'Internal Server Error',
      message: 'Unable to delete standard set. Please try again later.'
    })
  }
}
