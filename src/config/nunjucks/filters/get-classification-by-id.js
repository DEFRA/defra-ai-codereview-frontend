/**
 * Find a classification by ID from an array of classifications
 * @param {Array<{_id: string, name: string}>} classifications - Array of classifications
 * @param {string} id - The classification ID to find
 * @returns {object | undefined} The found classification or undefined
 */
export function getClassificationById(classifications, id) {
  return classifications.find((c) => c._id === id)
}
