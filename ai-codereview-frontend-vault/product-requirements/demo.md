
# User Story:
AS A user of the Intelligent Code Reviewer,  
I WANT to view detailed information about a standard set—including a list of standards and their classifications—in a structured and accessible format,  
SO THAT I can quickly understand and assess the standards and their context.

# Acceptance Criteria:
- **Scenario 1: Navigating to the Standard Set Detail Page**  
  **Given** the user is on the `/standards/standard-sets` listing page,  
  **When** the user clicks on a standard set name,  
  **Then** they are navigated to the `/standards/standard-sets/{id}` page with the corresponding standard set details.

- **Scenario 2: Displaying Standard Set Details**  
  **Given** a valid standard set id is provided in the URL,  
  **When** the `/standards/standard-sets/{id}` page loads,  
  **Then** the page fetches standard set details from the `/api/v1/standard-sets/{standard_set_id}` endpoint and displays:
  - The standard set name.
  - The repository URL as a clickable link that opens in a new tab.

- **Scenario 3: Rendering the Standards Table**  
  **Given** the standard set details are retrieved successfully,  
  **When** the page renders,  
  **Then** a table is displayed (using the `govuk-table` component) with two columns:
  - **Standard:** Each row uses a `govuk-details` component where the summary is the first header extracted from the standard’s markdown text using the `marked` library.
  - **Classifications:** Each standard’s classification names are displayed as blue `govuk-tag` components.

- **Scenario 4: Handling API Errors**  
  **Given** an invalid or unknown standard set id is provided,  
  **When** the API call fails,  
  **Then** an error message “Unable to fetch standard set details. Please try again later.” is displayed using a `govuk-error-summary` component.

Interface Design:
- **Header Section:**
  - Display the standard set name in a prominent heading.
  - Show the repository URL as a clickable link that opens in a new tab.
- **Standards Table:**
  - Use the `govuk-table` component to structure the data in two columns: Standard and Classifications.
  - **Standard Column:**
    - Each cell contains a `govuk-details` component.
    - The summary text for the `govuk-details` is derived by parsing the markdown text and extracting the first header using the `marked` npm library.
  - **Classifications Column:**
    - Each classification name is rendered as a blue `govuk-tag` component.
- **Accessibility:**
  - Ensure the interface adheres to GOV.UK Accessibility Guidelines.
  - Use proper ARIA attributes, focus management, and keyboard navigability.
- **Navigation Enhancement:**
  - Update the `/standards/standard-sets` page to make each standard set name clickable, linking to its respective `/standards/standard-sets/{id}` detail page.

# Technical Design:
- **Routing & Data Fetching:**
  - **New Route:**  
    - Create a new route `/standards/standard-sets/{id}` in the Node.js + Hapi.js application.
  - **API Calls:**
    - Fetch standard set details from the backend API endpoint:  
      `GET /api/v1/standard-sets/{standard_set_id}`
    - Fetch classification mappings from:  
      `GET /api/v1/classifications`
  - **Data Processing:**
    - Parse the returned standard set data to extract:
      - Standard set name and repository URL.
      - Array of standards.
    - For each standard, parse the markdown text using the `marked` npm library to extract the first header for use as the summary in the `govuk-details` component.
    - Map each standard’s `classification_ids` to their corresponding names using the classification data.
- **User Interface Rendering:**
  - Use Nunjucks templates with the `govuk-frontend` npm library.
  - Implement the following GOV.UK components:
    - `govuk-table` for displaying the list of standards.
    - `govuk-details` for expandable details in the standards column.
    - `govuk-tag` for displaying classification names.
    - `govuk-error-summary` for error message display.
- **Error Handling:**
  - If the standard set id is invalid or the API returns an error, render an error message within a `govuk-error-summary` component stating:  
    "Unable to fetch standard set details. Please try again later."
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
    
- **Integration with Existing Functionality:**
  - Modify the `/standards/standard-sets` page so that each standard set name in the list is a clickable link that navigates to the new detail page (`/standards/standard-sets/{id}`).
