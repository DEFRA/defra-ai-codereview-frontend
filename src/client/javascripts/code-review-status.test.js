/**
 * @jest-environment jsdom
 */

import {
  initStatusPolling,
  updateStatusElement,
  fetchReviewStatus,
  needsPolling
} from './code-review-status.js'

describe('Code Review Status', () => {
  let fetchMock
  let originalFetch
  let intervals = []

  beforeEach(() => {
    // Store original fetch
    originalFetch = global.fetch
    // Clear any previous intervals
    jest.useRealTimers()
    // Clear any previous DOM
    document.body.innerHTML = ''
    // Reset all mocks
    jest.clearAllMocks()
    // Track intervals
    const originalSetInterval = global.setInterval
    global.setInterval = (...args) => {
      const interval = originalSetInterval(...args)
      intervals.push(interval)
      return interval
    }
  })

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch
    // Clear any remaining intervals
    intervals.forEach(clearInterval)
    intervals = []
    // Restore original setInterval
    global.setInterval = setInterval
    // Clear timers
    jest.useRealTimers()
  })

  describe('updateStatusElement', () => {
    let statusElement

    beforeEach(() => {
      statusElement = document.createElement('strong')
      statusElement.className = 'govuk-tag'
      document.body.appendChild(statusElement)
    })

    it('should update text content and aria-label', () => {
      updateStatusElement(statusElement, 'completed')
      expect(statusElement.textContent).toBe('Completed')
      expect(statusElement.getAttribute('aria-label')).toBe(
        'Review status: Completed'
      )
    })

    it('should format status with underscores', () => {
      updateStatusElement(statusElement, 'in_progress')
      expect(statusElement.textContent).toBe('In progress')
      expect(statusElement.getAttribute('aria-label')).toBe(
        'Review status: In progress'
      )
    })

    it('should add red tag class for failed status', () => {
      updateStatusElement(statusElement, 'failed')
      expect(statusElement.classList.contains('govuk-tag--red')).toBe(true)
    })

    it('should add green tag class for completed status', () => {
      updateStatusElement(statusElement, 'completed')
      expect(statusElement.classList.contains('govuk-tag--green')).toBe(true)
    })

    it('should add blue tag class for other statuses', () => {
      updateStatusElement(statusElement, 'pending')
      expect(statusElement.classList.contains('govuk-tag--blue')).toBe(true)
    })
  })

  describe('fetchReviewStatus', () => {
    beforeEach(() => {
      fetchMock = jest.fn()
      global.fetch = fetchMock
    })

    it('should fetch status successfully', async () => {
      const mockResponse = { id: '123', status: 'completed' }
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await fetchReviewStatus('123')
      expect(result).toEqual(mockResponse)
      expect(fetchMock).toHaveBeenCalledWith('/api/code-reviews/123/status')
    })

    it('should throw error on failed fetch', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(fetchReviewStatus('123')).rejects.toThrow(
        'Failed to fetch status for review 123: 404'
      )
    })

    it('should throw error on network failure', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      await expect(fetchReviewStatus('123')).rejects.toThrow('Network error')
    })
  })

  describe('needsPolling', () => {
    it('should return true for pending status', () => {
      expect(needsPolling('pending')).toBe(true)
    })

    it('should return true for in progress status', () => {
      expect(needsPolling('in progress')).toBe(true)
    })

    it('should return true for started status', () => {
      expect(needsPolling('started')).toBe(true)
    })

    it('should handle case insensitivity', () => {
      expect(needsPolling('PENDING')).toBe(true)
      expect(needsPolling('In Progress')).toBe(true)
    })

    it('should handle whitespace', () => {
      expect(needsPolling('  pending  ')).toBe(true)
      expect(needsPolling('  completed  ')).toBe(false)
    })

    it('should return false for completed status', () => {
      expect(needsPolling('completed')).toBe(false)
    })

    it('should return false for failed status', () => {
      expect(needsPolling('failed')).toBe(false)
    })
  })

  describe('initStatusPolling', () => {
    beforeEach(() => {
      // Mock fetch
      fetchMock = jest.fn()
      global.fetch = fetchMock
      // Use fake timers
      jest.useFakeTimers()
    })

    it('should not start polling if no reviews are present', () => {
      // Setup
      document.body.innerHTML = '<div></div>'

      // Act
      initStatusPolling()

      // Assert
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('should not poll for completed reviews', () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <strong data-review-id="123" class="govuk-tag govuk-tag--green">Completed</strong>
        </div>
      `

      // Act
      initStatusPolling()
      jest.advanceTimersByTime(10000)

      // Assert
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('should poll for pending reviews', async () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <strong data-review-id="123" class="govuk-tag">Pending</strong>
        </div>
      `
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', status: 'completed' })
      })

      // Act
      initStatusPolling()

      // Let all microtasks and timers complete
      await Promise.resolve()
      await jest.runAllTimersAsync()
      await Promise.resolve()

      // Assert
      expect(fetchMock).toHaveBeenCalledWith('/api/code-reviews/123/status')
      expect(document.querySelector('[data-review-id]').textContent).toBe(
        'Completed'
      )
      expect(document.querySelector('[data-review-id]').className).toContain(
        'govuk-tag--green'
      )
    })

    it('should poll for in progress reviews', async () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <strong data-review-id="123" class="govuk-tag">In Progress</strong>
        </div>
      `
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', status: 'failed' })
      })

      // Act
      initStatusPolling()

      // Let all microtasks and timers complete
      await Promise.resolve()
      await jest.runAllTimersAsync()
      await Promise.resolve()

      // Assert
      expect(fetchMock).toHaveBeenCalledWith('/api/code-reviews/123/status')
      expect(document.querySelector('[data-review-id]').textContent).toBe(
        'Failed'
      )
      expect(document.querySelector('[data-review-id]').className).toContain(
        'govuk-tag--red'
      )
    })

    it('should handle API errors silently', async () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <strong data-review-id="123" data-status="Pending">Pending</strong>
        </div>
      `
      global.fetch = jest.fn(() => Promise.reject(new Error('API Error')))

      // Act
      initStatusPolling()
      await jest.advanceTimersByTime(5000)

      // Assert
      expect(document.querySelector('strong').textContent).toBe('Pending')
      expect(global.fetch).toHaveBeenCalledTimes(1)
    }, 15000)

    it('should stop polling when no more in-progress reviews exist', async () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <strong data-review-id="123" class="govuk-tag">Pending</strong>
        </div>
      `
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', status: 'completed' })
      })

      // Act
      initStatusPolling()

      // Let all microtasks and timers complete
      await Promise.resolve()
      await jest.runAllTimersAsync()
      await Promise.resolve()

      // Advance time and check no more calls
      jest.advanceTimersByTime(10000)
      await Promise.resolve()

      // Assert
      expect(fetchMock).toHaveBeenCalledTimes(1) // Should not poll again after completion
    })

    it('should continue polling on API errors', async () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <strong data-review-id="123" class="govuk-tag">Pending</strong>
        </div>
      `
      fetchMock
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: '123', status: 'completed' })
        })

      // Act
      initStatusPolling()

      // Let first error complete
      await Promise.resolve()
      await jest.runAllTimersAsync()
      await Promise.resolve()

      // Let second check complete
      jest.advanceTimersByTime(10000)
      await Promise.resolve()
      await jest.runAllTimersAsync()
      await Promise.resolve()

      // Assert
      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(document.querySelector('[data-review-id]').textContent).toBe(
        'Completed'
      )
    })

    it('should poll for started reviews', async () => {
      // Setup
      document.body.innerHTML = `
        <div>
          <strong data-review-id="123" class="govuk-tag">Started</strong>
        </div>
      `
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', status: 'completed' })
      })

      // Act
      initStatusPolling()

      // Let all microtasks and timers complete
      await Promise.resolve()
      await jest.runAllTimersAsync()
      await Promise.resolve()

      // Assert
      expect(fetchMock).toHaveBeenCalledWith('/api/code-reviews/123/status')
      expect(document.querySelector('[data-review-id]').textContent).toBe(
        'Completed'
      )
      expect(document.querySelector('[data-review-id]').className).toContain(
        'govuk-tag--green'
      )
    })
  })
})
