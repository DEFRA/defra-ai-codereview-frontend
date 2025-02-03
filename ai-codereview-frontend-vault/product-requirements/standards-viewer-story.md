# User Story Summary

**As a** user of the internal standards management system,  
**I want** to view detailed information for a specific standard set along with its associated standards in a GDS-compliant interface,  
**So that** I can quickly review and understand the standard set details and its related standards with their classification tags.

## Acceptance Criteria
### BDD Scenarios

#### Scenario: Navigating to the standard set details page from the list
* Given I am on the standards sets list page
* When I click on a standard set name
* Then I should be redirected to /standards/standard-sets/{id}
* And the page displays the standard set's name and a clickable repository URL that opens in a new tab
* And a table listing each standard with its parsed markdown content and associated classification tags.

#### Scenario: Successfully loading a valid standard set details page
* Given I access /standards/standard-sets/{id} with a valid standard set ID
* When the page loads
* Then it should retrieve the standard set data from GET /api/v1/standard-sets/{id}
* And fetch the classification data from GET /api/v1/classifications
* And display the standard set's name, repository URL, and a table where:
  * Each standard is presented using a GDS Details component with the first header or line of markdown as the summary
  * The markdown text is parsed into HTML
  * Each classification ID is mapped to its corresponding classification name and rendered as a GOV.UK tag.

#### Scenario: Handling an invalid or unknown standard set ID
* Given I access /standards/standard-sets/{id} with an invalid or unknown ID
* Then I should see an appropriate error message indicating that the standard set could not be found.

## Technical Design

### 1. New /standards/standard-sets/{id} Page
#### Route Setup:
* Create a new route in the Node.js application for /standards/standard-sets/{id}.
* Follow existing service and controller patterns to ensure code organisation, readability, and testability.

#### UI Implementation:
* Use GOV.UK Frontend components, such as `<details class="govuk-details">` for the details component, table styles, and `<strong class="govuk-tag">` for classification badges.
* Ensure the page layout is GDS-compliant and responsive.

### 2. Data Sources and Fetching
#### Standard Set Data:
* Endpoint: GET /api/v1/standard-sets/{standard_set_id}
* Usage: Retrieves the standard set details including the name, repository URL, custom prompt, and an array of standards.
* Example Response:

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
      "text": "# JavaScript Coding Standards\n\n## 1. **Code Structure**\n- Use meaningful and descriptive names for variables, functions, and classes.\n- Organise code into reusable modules or components.\n- Follow the single responsibility principle (SRP) for functions and classes.\n",
      "repository_path": "javascript_standards.md",
      "standard_set_id": "6798e6aee5152baa5eb4890a",
      "classification_ids": [
        "6798e68ee5152baa5eb488fd"
      ]
    }
  ]
}
```

#### Classification Data:
* Endpoint: GET /api/v1/classifications
* Usage: Provides mapping between classification IDs and classification names.
* Example Response:

```json
[
  {
    "name": "Javascript",
    "_id": "6798f38a1cb87d7c7420b540",
    "created_at": "2025-01-28T15:11:06.111000",
    "updated_at": "2025-01-28T15:11:06.111000"
  },
  {
    "name": "Node.js",
    "_id": "6798f3911cb87d7c7420b546",
    "created_at": "2025-01-28T15:11:13.289000",
    "updated_at": "2025-01-28T15:11:13.289000"
  }
]
```

### 3. Display and Rendering
#### Standard Set Details:
* Display the standard set's name prominently.
* Render the repository_url as a clickable link that opens in a new tab.

#### Standards Table:
* For each standard in the standards array:
  * Standard Column:
    * Use a GDS Details component (`<details class="govuk-details">`) with the summary text derived from the first header or line of the markdown text.
    * Parse the markdown using the existing 'marked' library.
  * Classifications Column:
    * Map each classification_id to its corresponding classification name retrieved from the classifications API.
    * Display each classification name as a GOV.UK style tag using `<strong class="govuk-tag">`.

### 4. Update to /standards/standard-sets Page
* Modify the standard set list page so that each standard set name is a clickable link.
* The link should navigate to the new /standards/standard-sets/{id} page, passing the correct unique _id for retrieval and display of the details.

### 5. Design and Accessibility Considerations
* Ensure the UI adheres to GOV.UK Design System standards for headings, tables, details components, and tags.
* Maintain accessibility with descriptive link text for screen readers, proper keyboard navigability, and responsive design for mobile devices.