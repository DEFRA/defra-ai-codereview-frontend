import {
  createAll,
  Button,
  Checkboxes,
  ErrorSummary,
  Header,
  Radios,
  SkipLink
} from 'govuk-frontend'

import { initStatusPolling } from './code-review-status.js'

createAll(Button)
createAll(Checkboxes)
createAll(ErrorSummary)
createAll(Header)
createAll(Radios)
createAll(SkipLink)

// Initialize status polling if we're on the code reviews page
if (document.querySelector('[data-review-id]')) {
  initStatusPolling()
}
