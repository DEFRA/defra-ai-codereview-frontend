# Product Requirements Document (PRD)
## Code Review Web Application

**Version:** 1.0  
**Date:** 14 January 2025 

---

## 1. Overview

This document serves as the Product Requirements Document (PRD) for the Code Review Web Application. The application is built using Node.js (via the Hapi.js framework) and follows GOV.UK design guidelines, style, and progressive enhancement principles.  

The primary goal of the application is to allow users to submit a code repository URL for review against defined standards. The system then processes the request and returns a compliance report, along with the status of the review.  

## 2. Objectives

1. **Accept Code Review Requests**: Provide a simple interface to accept a repository URL for review.  
2. **Display Code Review Details**: Display the status and details of each code review.  
3. **List All Code Reviews**: List all submitted code review requests.  
4. **Adherence to GOV.UK Standards**: Follow GOV.UK design principles, style guides, and use the `govuk-frontend` library with Nunjucks templates.  
5. **Progressive Enhancement**: Ensure the application is accessible and works well across different devices and browsers without relying on large front-end frameworks.  

## 3. Scope

The scope of this PRD includes the following pages and features:

1. **Home Page** (existing, to be updated):
   - A form to accept a code repository URL.
   - Submission logic to create a new code review record.
   - Redirection to the "Code Review Record Detail Page" after successful creation.

2. **Code Review Record Detail Page** (new):
   - Displays the details of a single code review record (repository, status, created/updated timestamps).
   - Placeholder tab component for future code review reports.

3. **Code Review List Page** (new):
   - Lists all existing code review records with key properties.
   - Links to each record's detail page.

4. **Navigation Update**:
   - Add a new navigation item "Code Reviews" linking to the Code Review List Page.

**Outside of Scope**:
- Actual code inspection logic and retrieving compliance reports (assumed to be handled by the backend).

## 4. Current Context

### 4.1 Existing Application
- The application currently has a basic skeleton with:
  - **Home Page**: Minimal content (to be updated).
- The backend is powered by Hapi.js with a set of RESTful APIs for code reviews.

### 4.2 Existing APIs

| HTTP Method | Endpoint                           | Description                                                  |
|------------|-------------------------------------|--------------------------------------------------------------|
| `GET`      | `/api/v1/code-reviews`             | Retrieve a list of code review records.                      |
| `POST`     | `/api/v1/code-reviews`             | Create a new code review record. Requires `repository_url`.  |
| `GET`      | `/api/v1/code-reviews/{_id}`       | Retrieve a specific code review record by its `_id`.         |

#### Request and Response Schemas

**CodeReview**  
```json
{
  "_id": "string (24 hex characters)",
  "repository_url": "string",
  "status": "string (one of: started, in_progress, completed, failed)",
  "compliance_report": "string or null",
  "created_at": "string (date-time)",
  "updated_at": "string (date-time)"
}
```

**CodeReviewCreate**  
```json
{
  "repository_url": "string"
}
```

**HTTPValidationError & ValidationError**  
Used for validation responses, following standard error object structure:
```json
{
  "detail": [
    {
      "loc": ["string or integer"],
      "msg": "string",
      "type": "string"
    }
  ]
}
```

## 5. Functional Requirements

### 5.1 Home Page

- **Path**: `/`
- **UI Updates**:
  1. **Text Box**: `Repository URL` (required, must be a valid web URL).
  2. **Submit Button**: Labeled "Generate code review".
- **Behavior**:
  - On click of the submit button:
    - **POST** to `/api/v1/code-reviews` with JSON body:
      ```json
      {
        "repository_url": "<value from text box>"
      }
      ```
    - If successful:
      - The response will include the newly created code review record (`_id`, etc.).
      - Redirect user to `"/code-reviews/{_id}"`.
    - If an error occurs (e.g., invalid URL, server error), display an appropriate validation or error message.

- **Design**:
  - Follow [GOV.UK Design Principles](https://www.gov.uk/guidance/government-design-principles).
  - Use form components from the [GOV.UK Design System Components](https://design-system.service.gov.uk/components/).
  - Apply [GOV.UK Style Guide](https://www.gov.uk/guidance/style-guide) best practices for label and button text.
  - Implement progressive enhancement (plain JavaScript to handle form submission gracefully).

**Acceptance Criteria**  
- A user can enter a valid URL and submit it.
- The system successfully creates a new code review record and redirects to the detail page.
- Invalid URLs or other validation errors are shown according to GOV.UK patterns.

### 5.2 Code Review Record Detail Page

- **Path**: `/code-reviews/{id}`
- **Behavior**:
  - On page load, **GET** `/api/v1/code-reviews/{id}` to fetch the code review record.
  - If the record does not exist, display an appropriate "Record not found" message or use the recommended GOV.UK error pattern.
- **Displayed Information**:
  1. **Code Repository**: `repository_url`
  2. **CreatedAt**: In `yyyy-mm-dd HH:ii:ss` format.
  3. **UpdatedAt**: In `yyyy-mm-dd HH:ii:ss` format.
  4. **Status**: The status of the code review (`started`, `in_progress`, `completed`, `failed`).
  5. **Tab Component**: Placeholder for future code review report details.

- **Design**:
  - Use the [GOV.UK Design System](https://design-system.service.gov.uk/) typography, spacing, and layout conventions.
  - The tab component can be a GOV.UK component or a custom progressive enhancement approach using vanilla JavaScript.

**Acceptance Criteria**  
- The page correctly displays all attributes of the code review record.
- If a record is not found, a GOV.UK style error message is shown.
- The tab component placeholder is present (no actual report content yet).

### 5.3 Code Review List Page

- **Path**: `/code-reviews`
- **Behavior**:
  - On page load, **GET** `/api/v1/code-reviews` to retrieve a list of all code review records.
  - Render the results in a table:
    - **Code Repository** (links to `/code-reviews/{_id}`).
    - **CreatedAt** (formatted `yyyy-mm-dd HH:ii:ss`).
    - **UpdatedAt** (formatted `yyyy-mm-dd HH:ii:ss`).
    - **Status**.
- **Navigation**:
  - Add a new top-level navigation item, "Code Reviews", pointing to `/code-reviews`.

- **Design**:
  - Implement the [GOV.UK Table component](https://design-system.service.gov.uk/components/table/) for listing records.
  - Ensure the link for each repository leads to the detail page for that review.

**Acceptance Criteria**  
- The table displays the required columns for all code review records.
- Each record's repository links to its detail page.
- A "Code Reviews" link exists in the main navigation to access this list page.

## 6. User Experience (UX) and GOV.UK Standards

1. **GOV.UK Design Principles**: Keep interfaces simple, consistent, and well structured.
2. **GOV.UK Style Guide**: Use plain language, consistent capitalization, and recommended typography guidelines.
3. **GOV.UK Design System**:
   - Use GOV.UK styles (`govuk-frontend`) and Nunjucks templates for all components (headers, footers, forms, tables, etc.).
   - Maintain accessibility best practices.
4. **Progressive Enhancement**:
   - Use vanilla JavaScript where needed; gracefully degrade if JavaScript is disabled.
   - No reliance on front-end frameworks like React, Vue, or Angular.

## 7. Technical Requirements

1. **Framework**: Hapi.js on Node.js (server side).
2. **Views / Templates**: Nunjucks templating engine combined with `govuk-frontend`.
3. **Routing**:
   - **Home Page**: `GET /`
   - **Code Review Detail**: `GET /code-reviews/{id}`
   - **Code Review List**: `GET /code-reviews`
4. **Backend Integrations**:
   - On submission from Home Page: `POST /api/v1/code-reviews`
   - Retrieve single review: `GET /api/v1/code-reviews/{id}`
   - Retrieve list of reviews: `GET /api/v1/code-reviews`
5. **Data Formatting**:
   - Timestamps displayed as `yyyy-mm-dd HH:ii:ss` (ISO-based with local time zone or UTC).
6. **Validation**:
   - Ensure `repository_url` is a valid URL before sending to the backend.
   - Handle errors with GOV.UK-compliant error messaging.

## 8. Non-functional Requirements

1. **Accessibility**: Must meet WCAG 2.1 AA standards.
2. **Performance**: Pages should load quickly, especially under typical government or low-bandwidth environments.
3. **Security**: Follow best practices for input validation, secure transmission (HTTPS), and sanitizing user inputs.
4. **Maintainability**: Code should be well structured and follow Node.js and Hapi.js best practices. GOV.UK recommended patterns for separation of concerns (routes, handlers, views).
5. **Scalability**: Should handle an increasing number of code review records without significant performance degradation.

## 9. Acceptance Criteria Summary

1. **Home Page**  
   - User can submit a valid repository URL.  
   - On success, user is redirected to the detail page of the newly created record.  
   - Invalid URL or server errors are displayed using GOV.UK-style error messages.

2. **Code Review Record Detail Page**  
   - Displays all relevant information (repository, timestamps, status).  
   - Shows placeholder tab component for future enhancements.  
   - Shows appropriate error if record is not found.

3. **Code Review List Page**  
   - Displays a table of all existing code reviews.  
   - Each table row links to the corresponding detail page.  
   - "Code Reviews" navigation item is added and functional.

4. **GOV.UK Compliance**  
   - Use GOV.UK styles, layout, and UI components.  
   - Follow progressive enhancement principles (no front-end frameworks).

## 10. Appendix

### 10.1 References

- [GOV.UK Design Principles](https://www.gov.uk/guidance/government-design-principles)  
- [GOV.UK Style Guide](https://www.gov.uk/guidance/style-guide)  
- [GOV.UK Design System](https://design-system.service.gov.uk/)  
- [GOV.UK Components](https://design-system.service.gov.uk/components/)  
- [GOV.UK Patterns](https://design-system.service.gov.uk/patterns/)  
- [Progressive Enhancement](https://technology.blog.gov.uk/2016/09/19/why-we-use-progressive-enhancement-to-build-gov-uk/)  
- [Hapi.js Documentation](https://hapi.dev/)  
