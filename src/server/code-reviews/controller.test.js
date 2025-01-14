import { getCodeReviews, getCodeReviewById } from './controller.js'
import { config } from '~/src/config/config.js'

describe('Code Reviews Controller', () => {
  let mockRequest
  let mockH
  let fetchSpy
  const mockReview = {
    _id: '123456789012345678901234',
    repository_url: 'https://github.com/test/repo1',
    status: 'completed',
    created_at: '2024-01-14T12:00:00Z',
    updated_at: '2024-01-14T13:00:00Z'
  }

  beforeEach(() => {
    mockRequest = {
      logger: {
        error: jest.fn()
      },
      params: {
        id: '123456789012345678901234'
      }
    }

    mockH = {
      view: jest.fn().mockReturnThis()
    }

    fetchSpy = jest.spyOn(global, 'fetch')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getCodeReviews', () => {
    const mockReviews = [mockReview]

    it('should fetch and format code reviews', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReviews)
      })

      await getCodeReviews(mockRequest, mockH)

      expect(fetchSpy).toHaveBeenCalledWith(
        `${config.get('apiBaseUrl')}/api/v1/code-reviews`
      )
      expect(mockH.view).toHaveBeenCalledWith('code-reviews/index', {
        pageTitle: 'Code Reviews',
        codeReviews: expect.arrayContaining([
          expect.objectContaining({
            _id: mockReviews[0]._id,
            repository_url: mockReviews[0].repository_url,
            status: mockReviews[0].status,
            created_at: '14 January 2024 at 12:00pm',
            updated_at: '14 January 2024 at 1:00pm',
            detailUrl: `/code-reviews/${mockReviews[0]._id}`
          })
        ])
      })
    })

    it('should handle API errors', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('API Error'))

      await getCodeReviews(mockRequest, mockH)

      expect(mockRequest.logger.error).toHaveBeenCalled()
      expect(mockH.view).toHaveBeenCalledWith('error/index', {
        statusCode: 500,
        title: 'Error',
        message: 'Unable to fetch code reviews'
      })
    })

    it('should handle non-ok response', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await getCodeReviews(mockRequest, mockH)

      expect(mockRequest.logger.error).toHaveBeenCalled()
      expect(mockH.view).toHaveBeenCalledWith('error/index', {
        statusCode: 500,
        title: 'Error',
        message: 'Unable to fetch code reviews'
      })
    })
  })

  describe('getCodeReviewById', () => {
    it('should fetch and format a single code review', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReview)
      })

      await getCodeReviewById(mockRequest, mockH)

      expect(fetchSpy).toHaveBeenCalledWith(
        `${config.get('apiBaseUrl')}/api/v1/code-reviews/${mockRequest.params.id}`
      )
      expect(mockH.view).toHaveBeenCalledWith('code-reviews/detail', {
        pageTitle: 'Code Review Details',
        review: expect.objectContaining({
          _id: mockReview._id,
          repository_url: mockReview.repository_url,
          status: mockReview.status,
          created_at: '14 January 2024 at 12:00pm',
          updated_at: '14 January 2024 at 1:00pm'
        })
      })
    })

    it('should handle 404 errors', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await getCodeReviewById(mockRequest, mockH)

      expect(mockH.view).toHaveBeenCalledWith('error/index', {
        pageTitle: 'Code review not found',
        heading: 'Code review not found',
        message:
          'The code review you are looking for does not exist. This may be because:',
        messageList: [
          'the URL is incorrect',
          'the code review has been deleted',
          'you do not have permission to view this code review'
        ]
      })
    })

    it('should handle 401 errors', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 401
      })

      await getCodeReviewById(mockRequest, mockH)

      expect(mockH.view).toHaveBeenCalledWith('error/index', {
        pageTitle: 'Unauthorized',
        heading: 'You are not authorized to view this code review',
        message:
          'Please check that you have the correct permissions and try again.'
      })
    })

    it('should handle 403 errors', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 403
      })

      await getCodeReviewById(mockRequest, mockH)

      expect(mockH.view).toHaveBeenCalledWith('error/index', {
        pageTitle: 'Forbidden',
        heading: 'You do not have permission to view this code review',
        message:
          'Please contact your administrator if you believe this is incorrect.'
      })
    })

    it('should handle other non-ok responses', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await getCodeReviewById(mockRequest, mockH)

      expect(mockRequest.logger.error).toHaveBeenCalled()
      expect(mockH.view).toHaveBeenCalledWith('error/index', {
        pageTitle: 'Sorry, there is a problem with the service',
        heading: 'Sorry, there is a problem with the service',
        message:
          'Try again later. If the problem persists, please contact support.',
        statusCode: 500
      })
    })

    it('should handle API errors', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('API Error'))

      await getCodeReviewById(mockRequest, mockH)

      expect(mockRequest.logger.error).toHaveBeenCalled()
      expect(mockH.view).toHaveBeenCalledWith('error/index', {
        pageTitle: 'Sorry, there is a problem with the service',
        heading: 'Sorry, there is a problem with the service',
        message:
          'Try again later. If the problem persists, please contact support.',
        statusCode: 500
      })
    })
  })

  describe('formatDate', () => {
    it('should handle noon (12pm)', async () => {
      const noonReview = {
        ...mockReview,
        created_at: '2024-01-14T12:00:00Z',
        updated_at: '2024-01-14T12:00:00Z'
      }

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(noonReview)
      })

      await getCodeReviewById(mockRequest, mockH)

      expect(mockH.view).toHaveBeenCalledWith('code-reviews/detail', {
        pageTitle: 'Code Review Details',
        review: expect.objectContaining({
          created_at: '14 January 2024 at 12:00pm',
          updated_at: '14 January 2024 at 12:00pm'
        })
      })
    })

    it('should handle midnight (12am)', async () => {
      const midnightReview = {
        ...mockReview,
        created_at: '2024-01-14T00:00:00Z',
        updated_at: '2024-01-14T00:00:00Z'
      }

      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(midnightReview)
      })

      await getCodeReviewById(mockRequest, mockH)

      expect(mockH.view).toHaveBeenCalledWith('code-reviews/detail', {
        pageTitle: 'Code Review Details',
        review: expect.objectContaining({
          created_at: '14 January 2024 at 12:00am',
          updated_at: '14 January 2024 at 12:00am'
        })
      })
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
