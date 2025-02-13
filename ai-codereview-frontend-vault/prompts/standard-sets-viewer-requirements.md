Create a detailed user story document in an markdown format outlining the following feature requirements. 

Please provide the contents for a file named standards-viewer-story.md in a markdown code block.

I want the format of the user story to be: 

---
User Story:
[User story summary in "AS A, I WANT, SO THAT" format. This be functional and omit technical details]

Acceptance Criteria: 
[BBD Scenarios. Note the BDD Scenarios should be functional and omit technical details. Try and avoid overlapping functionality so that we keep the number of scenarios to a minimum]

Interface Design:
[Relevant user interface design. This is a GOV.UK Application so it should follow GOV.UK guidelines including the GDS Design System and Accessibility. Ensure you include the GDS Components needed for the interface]

Technical Design:
[The functionality defined in technical detail.  Include the API Responses as examples from below]

-----------

# Context

This is an new set of functionality on an existing application called the "intelligent code reviewer". It is a GOV.UK Application that follows GDS Guidelines. Technology-wise, the "intelligent code reviewer" frontend is a Node.js Application that does server-side rendering and follows progressive enhancement principles. The tech stack is 
- Node.js + Hapi.js
- govuk-frontend npm library
- Nunjucks templates
 
We currently have a list of standard sets being displayed on the `/standards/standard-sets` .  We want to add new functionality to allow a user to click on a standard set name, then go to a page that lists the standards, along with their classifications, in a table.

The interface must follow GOV.UK standards and style and use GDS components. It should also follow GOV.UK Accessibility Guidelines

# Detailed Requirements

## New `/standards/standard-sets/{id}` page

- Create a new page and a new route  `/standards/standard-sets/{id}`, where the `{id}` value is a valid standard set id.
- To get the data for the page, this page should query the backend api on the `/api/v1/standard-sets/{standard_set_id}` endpoint. The API query will return the standard set information, including the individual standards that are part of the standard set.  It will also call the `/api/v1/classifications` endpoint.  We will store the results of this api query so we can map the classification_ids to the classification names later in the page processing.
- Page Layout
	- At the top of the new page, list the standard set name and repository URL. Make the repository url clickable to launch a new tab that takes you to the repository url website
	- A table (`govuk-table`) that has two columns - standard and classifications. 
		- There will be a a row for each standard in the standards array. 
		- Each standards cell will contain a GDS Details component (`govuk-details`) with the summary text derived from the first header of the markdown text.
	- The summary text of the details component should be derived by parsing the markdown and using the content of the first header. The the 'marked' npm library which is already used by the application
	- Each Classifications cell will contain the classification names for that standard. Display each classification name as a GOV.UK style tag component (`govuk-tag`). Colour blue.

## Update the `/standards/standard-sets` page

- Update the `/standards/standard-sets` page to change the standard set name for each standard listed in the table to be clickable.  The link should go to the `/standards/standard-sets/{id}` page, passing the standard set id for each row in the table.

## Error Handling for API calls

If an invalid or unknown ID is provided, the page should display an error message "Unable to fetch standard set details. Please try again later." in a GDS Error Summary Component (`govuk-error-summary`)

## APIS
#### Standard Set Data:
* Endpoint: `GET /api/v1/standard-sets/{standard_set_id}`
* Usage: Retrieves the standard set details including the name, repository URL, custom prompt, and an array of standards.
* Example Response below. Note that the first heading in the text field is the title of the standard:

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

#### Classification Data:
* Endpoint: `GET /api/v1/classifications`
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

