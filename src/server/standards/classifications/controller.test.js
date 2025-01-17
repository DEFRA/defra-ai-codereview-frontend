import {
  getClassifications,
  createClassification,
  deleteClassification
} from './controller.js'
import { config } from '~/src/config/config.js'
import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation.js'

jest.mock('~/src/config/nunjucks/context/build-navigation.js')

describe('Classifications Controller', () => {
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
      },
      payload: {}
    }

    mockH = {
      view: jest.fn().mockReturnThis(),
      redirect: jest.fn(),
      code: jest.fn().mockReturnThis()
    }

    fetchSpy = jest.spyOn(global, 'fetch')
    buildNavigation.mockReturnValue([])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getClassifications', () => {
    const mockClassifications = [
      { _id: '1', name: 'Security' },
      { _id: '2', name: 'Performance' }
    ]

    it('should fetch and display classifications', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockClassifications)
      })

      await getClassifications(mockRequest, mockH)

      expect(fetchSpy).toHaveBeenCalledWith(
        `${config.get('apiBaseUrl')}/api/v1/classifications`
      )
      expect(mockH.view).toHaveBeenCalledWith(
        'standards/classifications/index',
        {
          pageTitle: 'Manage Classifications',
          classifications: mockClassifications,
          navigation: []
        }
      )
    })

    it('should handle API errors', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('API Error'))

      await getClassifications(mockRequest, mockH)

      expect(mockRequest.logger.error).toHaveBeenCalled()
      expect(mockH.view).toHaveBeenCalledWith('error/index', {
        statusCode: 500,
        title: 'Internal Server Error',
        message: 'Unable to fetch classifications. Please try again later.'
      })
    })
  })

  describe('createClassification', () => {
    it('should create a new classification', async () => {
      mockRequest.payload = { name: 'Test Classification' }
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ _id: '3', name: 'Test Classification' })
      })

      await createClassification(mockRequest, mockH)

      expect(fetchSpy).toHaveBeenCalledWith(
        `${config.get('apiBaseUrl')}/api/v1/classifications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: 'Test Classification' })
        }
      )
      expect(mockH.redirect).toHaveBeenCalledWith('/standards/classifications')
    })

    it('should validate classification name', async () => {
      mockRequest.payload = { name: '' }

      await createClassification(mockRequest, mockH)

      expect(mockH.view).toHaveBeenCalledWith(
        'standards/classifications/index',
        {
          pageTitle: 'Manage Classifications',
          navigation: [],
          errors: {
            name: {
              field: 'name',
              message: 'Enter a classification name'
            }
          },
          data: { name: '' }
        }
      )
      expect(mockH.code).toHaveBeenCalledWith(400)
    })
  })

  describe('deleteClassification', () => {
    it('should delete a classification', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true
      })

      await deleteClassification(mockRequest, mockH)

      expect(fetchSpy).toHaveBeenCalledWith(
        `${config.get('apiBaseUrl')}/api/v1/classifications/${mockRequest.params.id}`,
        {
          method: 'DELETE'
        }
      )
      expect(mockH.redirect).toHaveBeenCalledWith('/standards/classifications')
    })

    it('should handle delete errors', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('API Error'))

      await deleteClassification(mockRequest, mockH)

      expect(mockRequest.logger.error).toHaveBeenCalled()
      expect(mockH.view).toHaveBeenCalledWith('error/index', {
        statusCode: 500,
        title: 'Internal Server Error',
        message: 'Unable to delete classification. Please try again later.'
      })
    })
  })
})
