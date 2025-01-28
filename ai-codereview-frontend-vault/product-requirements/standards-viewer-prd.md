# Standards Viewer Product Requirements Document (PRD)

**Document Version**: 1.0  
**Date**: 2025-01-28  

## 1. Overview

This document outlines the requirements for extending the existing Node.js application that manages "standard sets" for an internal standards management system. The goal is to introduce a new page `/standards/standard-sets/{id}` which displays the details of a specific standard set and its associated standards in a GDS-compliant interface.

## 2. Objectives

1. **Create a new page**: `/standards/standard-sets/{id}` that:
   - Fetches data from the backend API.
   - Displays standard set details (name, repository URL).
   - Lists the standards belonging to the standard set in a table.
   - Shows classification tags for each standard.

2. **Enhance existing page**: `/standards/standard-sets` to:
   - Make the standard set names clickable links that navigate to the new page.

3. **Maintain GDS compliance**:
   - Use existing GOV.UK Design System styles and components.
   - Adhere to accessibility and usability guidelines.

4. **Follow Node.js best practices**:
   - Organized code structure.
   - Reuse existing service and controller patterns.
   - Ensure readability, maintainability, and testability.

## 3. Scope

### In Scope:
- Creating a new page and associated routes for standard set details.
- Updating an existing page to link to the new page.
- Displaying classification names using GDS-compliant tags.
- Adding GOV.UK accordion and table styling to the new page.

### Out of Scope:
- Any backend API changes outside of retrieving the existing data endpoints.
- Revamping the entire site's design (beyond reusing existing GDS-compatible components).
- Extensive content editing or rewriting—this PRD focuses on layout and functional display.

## 4. User Stories

1. **As a user**, I want to click on a standard set name on the `/standards/standard-sets` page so that I can view detailed information about that standard set on a dedicated page.
2. **As a user**, I want to see the standard set's repository URL so that I can navigate to the repository for more information.
3. **As a user**, I want the ability to see the entire text of each standard so that I can review detailed standards content.
4. **As a user**, I want to see relevant classification tags for each standard so that I can quickly identify the categories or types of those standards.

## 5. Functional Requirements

### 5.1 New `/standards/standard-sets/{id}` Page

1. **Page Route**  
   - **Path**: `/standards/standard-sets/{id}`
   - **Description**: Renders the details of a single standard set. This is a new route that needs adding to the routing

2. **Data Sources**  
   - **Classification Data**:  
     - **Endpoint**: `GET /api/v1/classifications`  
     - **Usage**: Needed to map classification IDs to classification names.  
   - **Standard Set Data**:  
     - **Endpoint**: `GET /api/v1/standard-sets/{standard_set_id}`  
     - **Usage**: Returns the standard set details (name, repository URL, custom prompt, array of standards).

3. **Display Requirements**  
   - **Title and Repository URL**  
     - Show the standard set's `name`.
     - Show the `repository_url` as a clickable link that opens in a new tab.  
   - **Standards Table**  
     - Each row represents one standard from the array `standards` in the response.
     - **Columns**:
       1. **Standard**:
          - Parse the Markdown text (`text`) into HTML.
       2. **Classifications**:
          - For each `classification_id` in the standard's `classification_ids`, map to the classification name from `/api/v1/classifications`.
          - Display each classification name as a GDS-style tag (e.g., `<strong class="govuk-tag">Classification Name</strong>`).

#### Example API Response

```json
{
  "name": "test-standards-set",
  "repository_url": "https://github.com/ee-todd/test-standards-set",
  "custom_prompt": "",
  "_id": "6798e6aee5152baa5eb4890a",
  "created_at": "2025-01-28T14:16:14.492000",
  "updated_at": "2025-01-28T14:16:14.492000",
  "standards": [
    {
      "_id": "6798e6b6e4a8cc3eb27f0409",
      "text": "# JavaScript Coding Standards\n\n## 1. **Code Structure**\n- Use meaningful and descriptive names for variables, functions, and classes.\n- Organize code into reusable modules or components.\n- Follow the single responsibility principle (SRP) for functions and classes.\n",
      "repository_path": "javascript_standards.md",
      "standard_set_id": "6798e6aee5152baa5eb4890a",
      "classification_ids": [
        "6798e68ee5152baa5eb488fd"
      ]
    }
  ]
}
```

### 5.2 Update the `/standards/standard-sets` Page

1. **Current Functionality**  
   - The page displays a list of standard sets in a table.
2. **New Requirement**  
   - Change the displayed "standard set name" to be a clickable link.
   - The link should direct to the new page: `/standards/standard-sets/{id}`.
   - Ensure each row correctly passes its unique `_id`.

## 6. UI/UX Requirements

1. **GDS Compliance**  
   - Use GOV.UK Frontend components for:
     - Headings (`govuk-heading-xl`, `govuk-heading-l`, etc.)
     - Table styles for the list of standards
     - Tags for classification badges
2. **Accessibility**  
   - Provide descriptive link text for "View standard set details" if using screen-reader-only text.
   - Ensure keyboard navigability for accordions and expansions.
3. **Responsive Design**  
   - The table and tags must adapt to various screen sizes.
   - The layout must maintain readability on mobile devices.

## 7. Acceptance Criteria

1. **Page Load**  
   - When `/standards/standard-sets/{id}` is accessed with a valid ID, the page loads:
     1. The standard set's name, repository URL (clickable).
     3. A table listing each standard with the parsed markdown as HTML and classification tags.
   - When `/standards/standard-sets/{id}` is accessed with an invalid or unknown ID, an appropriate error is displayed.

2. **Classification Tags**  
   - Each standard's `classification_ids` are successfully mapped to classification names retrieved from `/api/v1/classifications`.
   - Classification names are displayed as GOV.UK tags.

3. **Link from `/standards/standard-sets`**  
   - Clicking on a standard set name on `/standards/standard-sets` navigates the user to `/standards/standard-sets/{id}`.
   - The correct data is shown on the new page based on the passed `_id`.

4. **Design & Accessibility**  
   - The UI matches GDS design standards for tables, accordions, and tags.
   - The page passes accessibility checks (e.g., keyboard navigation, screen reader text).