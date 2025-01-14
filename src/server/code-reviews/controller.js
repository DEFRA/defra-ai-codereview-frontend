import { config } from '~/src/config/config.js'

/**
 * @typedef {object} CodeReview
 * @property {string} _id - The review ID
 * @property {string} repository_url - The repository URL
 * @property {string} status - The review status
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * Formats a date string into yyyy-mm-dd HH:ii:ss format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toISOString().replace('T', ' ').substring(0, 19)
}

/**
 * Handler for the code reviews list page
 */
export async function getCodeReviews(request, h) {
  try {
    const response = await fetch(
      `${config.get('apiBaseUrl')}/api/v1/code-reviews`
    )
    const codeReviews = await response.json()

    // Format dates and add detail page URLs
    const formattedReviews = codeReviews.map((review) => ({
      ...review,
      created_at: formatDate(review.created_at),
      updated_at: formatDate(review.updated_at),
      detailUrl: `/code-reviews/${review._id}`
    }))

    return h.view('code-reviews/index', {
      pageTitle: 'Code Reviews',
      codeReviews: formattedReviews
    })
  } catch (err) {
    request.logger.error('Error fetching code reviews:', err)
    return h.view('error/index', {
      statusCode: 500,
      title: 'Error',
      message: 'Unable to fetch code reviews'
    })
  }
}

/**
 * Handler for the code review detail page
 */
export async function getCodeReviewById(request, h) {
  try {
    const { id } = request.params
    const response = await fetch(
      `${config.get('apiBaseUrl')}/api/v1/code-reviews/${id}`
    )

    if (response.status === 404) {
      return h.view('error/index', {
        statusCode: 404,
        title: 'Not Found',
        message: 'Not Found'
      })
    }

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    const review = await response.json()

    return h.view('code-reviews/detail', {
      pageTitle: 'Code Review Details',
      review: {
        ...review,
        created_at: formatDate(review.created_at),
        updated_at: formatDate(review.updated_at)
      }
    })
  } catch (err) {
    request.logger.error('Error fetching code review:', err)
    return h.view('error/index', {
      statusCode: 500,
      title: 'Error',
      message: 'Error'
    })
  }
}
