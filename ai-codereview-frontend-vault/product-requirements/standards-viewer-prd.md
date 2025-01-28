# Standards Viewer Product Requirements Document (PRD)

**Document Version**: 1.0  
**Date**: 2025-01-28  

## 1. Overview

This document outlines the requirements for extending the existing Node.js application that manages "standard sets" for an internal standards management system. The goal is to introduce a new page `/standards/standard-sets/{id}` which displays the details of a specific standard set and its associated standards in a GDS-compliant interface.

## 2. Objectives

1. **Create a new page**: `/standards/standard-sets/{id}` that:
   - Fetches data from the backend API.
   - Displays standard set details (name, repository URL, custom prompt).
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
3. **As a user**, I want the ability to see the entire text of each standard in an expandable view so that I can review detailed standards content without cluttering the page.
4. **As a user**, I want to see relevant classification tags for each standard so that I can quickly identify the categories or types of those standards.
5. **As a user**, I want to view the custom prompt in a collapsible accordion so that I can optionally access or hide any additional instructions or notes.

## 5. Functional Requirements

### 5.1 New `/standards/standard-sets/{id}` Page

1. **Page Route**  
   - **Path**: `/standards/standard-sets/{id}`
   - **Description**: Renders the details of a single standard set.

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
   - **Custom Prompt**  
     - Use a GOV.UK accordion component titled "Custom Prompt".
     - Contents are hidden by default and expanded on click.
     - Inside the accordion, display the `custom_prompt` string from the API.
   - **Standards Table**  
     - Each row represents one standard from the array `standards` in the response.
     - **Columns**:
       1. **Repository Path**: 
          - Display `repository_path`.
          - Make it clickable to a new page (e.g., `{standard_set_repository_url}{repository_path}`) or a dedicated route as determined by your application's existing patterns.
       2. **Excerpt**:
          - Parse the Markdown text (`text`) into HTML.
          - Display a short excerpt (e.g., first 100–150 characters or first heading).
          - Include an expandable/collapsible section (using GOV.UK details or accordion component) to reveal the full text.
       3. **Classification Tags**:
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
      "text": "# JavaScript Coding Standards\n\n## 1. **Code Structure**\n- Use meaningful and descriptive names for variables, functions, and classes.\n- Organize code into reusable modules or components.\n- Follow the single responsibility principle (SRP) for functions and classes.\n\n## 2. **Syntax and Formatting**\n- Use camelCase for variable and function names, and PascalCase for class names.\n- Use `const` for constants and `let` for variables that may change; avoid `var`.\n- Prefer template literals (`\\``) over string concatenation for better readability.\n- Use strict equality (`===`) to avoid type coercion.\n\n## 3. **Code Style**\n- Indent using 2 spaces or a tab (be consistent across the project).\n- End statements with semicolons (`;`) for clarity and to avoid ambiguity.\n- Use single quotes (`'`) for strings unless double quotes are required.\n\n## 4. **Error Handling**\n- Use `try...catch` blocks for error-prone operations.\n- Validate inputs and handle edge cases gracefully.\n- Log meaningful error messages for debugging.\n\n## 5. **Comments and Documentation**\n- Write comments to explain the \"why\" of the code, not the \"what.\"\n- Use JSDoc-style comments for functions and complex blocks.\n- Keep comments up-to-date with code changes.\n\n## 6. **Best Practices**\n- Avoid global variables; use closures or modules instead.\n- Write unit tests for critical functions and components.\n- Use linting tools (e.g., ESLint) to enforce coding standards.\n- Minimize the use of inline JavaScript in HTML for better separation of concerns.\n\n## 7. **Version Control**\n- Commit changes with descriptive messages.\n- Follow a branching strategy (e.g., Git Flow) for version control.\n\nFollowing these guidelines ensures that your JavaScript code is maintainable, readable, and scalable.\n",
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
     - Headings (`govuk-heading-xl`, `govuk-heading-l`, etc.),
     - Accordion or details element for the custom prompt,
     - Table styles for the list of standards,
     - Tags for classification badges.
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
     2. An accordion containing the custom prompt.
     3. A table listing each standard with repository path, excerpt (expandable to full text), and classification tags.
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