import { getClassificationById } from './get-classification-by-id.js'

describe('getClassificationById', () => {
  const mockClassifications = [
    { _id: 'class1', name: 'Security' },
    { _id: 'class2', name: 'Performance' }
  ]

  it('should find classification by ID', () => {
    expect(getClassificationById(mockClassifications, 'class1')).toEqual({
      _id: 'class1',
      name: 'Security'
    })
  })

  it('should return undefined for non-existent ID', () => {
    expect(
      getClassificationById(mockClassifications, 'nonexistent')
    ).toBeUndefined()
  })

  it('should handle empty classifications array', () => {
    expect(getClassificationById([], 'class1')).toBeUndefined()
  })
})
