import {
  getStandardsHome,
  getClassifications,
  createClassification,
  deleteClassification
} from './controller.js'
import { config } from '~/src/config/config.js'
import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation.js'

jest.mock('~/src/config/nunjucks/context/build-navigation.js')

describe('Standards Controller', () => {
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

  describe('getStandardsHome', () => {
    it('should render the standards home page', () => {
      getStandardsHome(mockRequest, mockH)

      expect(mockH.view).toHaveBeenCalledWith('standards/index', {
        pageTitle: 'Standards Management',
        navigation: []
      })
      expect(buildNavigation).toHaveBeenCalledWith(mockRequest)
    })
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

    it('should handle non-ok response', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

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
    it('should create a new classification successfully', async () => {
      mockRequest.payload = { name: 'Security' }
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ _id: '1', name: 'Security' })
      })

      await createClassification(mockRequest, mockH)

      expect(fetchSpy).toHaveBeenCalledWith(
        `${config.get('apiBaseUrl')}/api/v1/classifications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: 'Security' })
        }
      )
      expect(mockH.redirect).toHaveBeenCalledWith('/standards/classifications')
    })

    it('should handle validation error - empty name', async () => {
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

    it('should handle validation error - invalid characters', async () => {
      mockRequest.payload = { name: 'Invalid@Name' }

      await createClassification(mockRequest, mockH)

      expect(mockH.view).toHaveBeenCalledWith(
        'standards/classifications/index',
        {
          pageTitle: 'Manage Classifications',
          navigation: [],
          errors: {
            name: {
              field: 'name',
              message:
                'Classification name can only contain letters, numbers, spaces, dots, hyphens and hash symbols'
            }
          },
          data: { name: 'Invalid@Name' }
        }
      )
      expect(mockH.code).toHaveBeenCalledWith(400)
    })

    it('should handle duplicate classification error', async () => {
      mockRequest.payload = { name: 'Security' }
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: () =>
          Promise.resolve({ message: 'Classification already exists' })
      })

      await createClassification(mockRequest, mockH)

      expect(mockH.view).toHaveBeenCalledWith(
        'standards/classifications/index',
        {
          pageTitle: 'Manage Classifications',
          navigation: [],
          errors: {
            name: {
              field: 'name',
              message: 'This classification name already exists'
            }
          },
          data: { name: 'Security' }
        }
      )
      expect(mockH.code).toHaveBeenCalledWith(400)
    })

    it('should handle API errors', async () => {
      mockRequest.payload = { name: 'Security' }
      fetchSpy.mockRejectedValueOnce(new Error('API Error'))

      await createClassification(mockRequest, mockH)

      expect(mockRequest.logger.error).toHaveBeenCalled()
      expect(mockH.view).toHaveBeenCalledWith('error/index', {
        statusCode: 500,
        title: 'Internal Server Error',
        message: 'Unable to create classification. Please try again later.'
      })
    })
  })

  describe('deleteClassification', () => {
    it('should delete a classification successfully', async () => {
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

    it('should handle API errors', async () => {
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
