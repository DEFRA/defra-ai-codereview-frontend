# User Story:
As a user of the Intelligent Code Reviewer, I want to click on a standard set name to view its detailed information—including a table of standards and their classifications—so that I can quickly and clearly review the coding standards in an accessible, GOV.UK compliant format.

# Acceptance Criteria:
**Scenario 1: Navigating to the Standard Set Detail Page**
- **Given** I am on the `/standards/standard-sets` page with a list of standard sets,
- **When** I click on a standard set name,
- **Then** I am redirected to the `/standards/standard-sets/{id}` page,
- **And** the page displays the standard set’s name and a clickable repository URL that opens in a new tab.

**Scenario 2: Displaying Standards and Classifications**
- **Given** I am on the `/standards/standard-sets/{id}` page,
- **When** the page loads,
- **Then** it queries the API endpoints `/api/v1/standard-sets/{standard_set_id}` and `/api/v1/classifications`,
- **And** displays a table (using `govuk-table`) with two columns: “Standard” and “Classifications”,
- **And** each standard is shown within a `govuk-details` component, using the first header from its markdown text (parsed via the 'marked' npm library) as the summary,
- **And** each classification is rendered as a blue `govuk-tag` component.

**Scenario 3: Handling an Invalid/Unknown Standard Set ID**
- **Given** I navigate to `/standards/standard-sets/{invalidId}`,
- **When** the provided ID is invalid or not found,
- **Then** the page displays an error message in a GDS Error Component stating "This Id could not be found".

Interface Design:
- **Header Section:**  
  - Display the standard set name prominently.  
  - Show the repository URL as a clickable link that opens in a new tab.
- **Table Layout:**  
  - Use the `govuk-table` component to create a two-column layout for “Standard” and “Classifications”.  
  - In the "Standard" column, embed a `govuk-details` component where the summary is derived by parsing the markdown text (using the 'marked' npm library) to extract the first header.  
  - In the "Classifications" column, render each classification as a blue `govuk-tag` component.
- **Accessibility & Responsiveness:**  
  - Ensure the design follows GOV.UK Accessibility Guidelines, including proper ARIA attributes where necessary.  
  - Use the govuk-frontend npm library to maintain consistency with GOV.UK Design standards and ensure responsive behavior across devices.

# Technical Design:
- **Routing and Data Fetching:**  
  - Add a new route `/standards/standard-sets/{id}` in the Node.js + Hapi.js application.  
  - On page load, perform two API calls:  
    1. GET `/api/v1/standard-sets/{standard_set_id}` to retrieve the standard set details (name, repository URL, and standards array).  
    2. GET `/api/v1/classifications` to retrieve the mapping of classification IDs to names.
- **Markdown Processing:**  
  - Use the 'marked' npm library to parse the markdown text in each standard.  
  - Extract the first header from the markdown to serve as the summary in the `govuk-details` component.
- **Template Rendering:**  
  - Render the page using Nunjucks templates, applying server-side rendering to incorporate GOV.UK components (`govuk-table`, `govuk-details`, and `govuk-tag`) as per GDS guidelines.
- **Error Handling:**  
  - If the standard set ID is invalid or the API returns an error, render a GDS Error Component with the message "This Id could not be found".
- **API Response Examples:**
  - **Standard Set Data:**
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
            "6798f38a1cb87d7c7420b540"
          ]
        }
      ]
    }
    ```
  - **Classification Data:**
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

- **Page Update for Standard Sets List:**  
  - Modify the `/standards/standard-sets` page to make each standard set name clickable, linking to the corresponding `/standards/standard-sets/{id}` page.
