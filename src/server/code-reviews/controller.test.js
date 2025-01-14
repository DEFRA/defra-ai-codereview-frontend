import { getCodeReviews, getCodeReviewById } from './controller.js'
import { config } from '~/src/config/config.js'

describe('Code Reviews Controller', () => {
  let mockRequest
  let mockH
  let fetchSpy

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
    const mockReviews = [
      {
        _id: '123456789012345678901234',
        repository_url: 'https://github.com/test/repo1',
        status: 'completed',
        created_at: '2024-01-14T12:00:00Z',
        updated_at: '2024-01-14T13:00:00Z'
      }
    ]

    it('should fetch and format code reviews', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          await Promise.resolve()
          return mockReviews
        }
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
            created_at: expect.any(String),
            updated_at: expect.any(String),
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
  })

  describe('getCodeReviewById', () => {
    const mockReview = {
      _id: '123456789012345678901234',
      repository_url: 'https://github.com/test/repo1',
      status: 'completed',
      created_at: '2024-01-14T12:00:00Z',
      updated_at: '2024-01-14T13:00:00Z'
    }

    it('should fetch and format a single code review', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          await Promise.resolve()
          return mockReview
        }
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
          created_at: expect.any(String),
          updated_at: expect.any(String)
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
        statusCode: 404,
        title: 'Not Found',
        message: 'Not Found'
      })
    })

    it('should handle API errors', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('API Error'))

      await getCodeReviewById(mockRequest, mockH)

      expect(mockRequest.logger.error).toHaveBeenCalled()
      expect(mockH.view).toHaveBeenCalledWith('error/index', {
        statusCode: 500,
        title: 'Error',
        message: 'Error'
      })
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
