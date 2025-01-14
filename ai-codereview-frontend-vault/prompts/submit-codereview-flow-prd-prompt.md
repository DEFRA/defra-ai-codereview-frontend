Create a detailed PRD document in an markdown format outlining the following feature requirements. I want the PRD to be in a single downloadable markdown file. Ensure you use the best practices standards.
## Context

We are writing a nodejs web application that reviews a code base and compares it to a set of standards, then produces a report.

The web application already has a skeleton layout, with a 'home' page.

We currently have a set of backend apis that are restful, with the following routes and schema:

```
GET

[/api/v1/code-reviews]

POST

[/api/v1/code-reviews]

Parameters:
{
  "repository_url": "string"
}

GET

[/api/v1/code-reviews/{_id}]

Parameters:
_id (string - part of path)


#### Schemas

CodeReview

Collapse all**object**

CodeReview model for responses.

- _id
    
    **string**matches ^[0-9a-fA-F]{24}$
    
- repository_url
    
    **string**
    
- status
    
    Expand all**string**
    
- compliance_report
    
    Expand all**(string | null)**
    
- created_at
    
    **string**date-time
    
- updated_at
    
    **string**date-time
    

CodeReviewCreate

Collapse all**object**

Input model for creating a code review.

- repository_url
    
    **string**
    

HTTPValidationError

Collapse all**object**

- detail
    
    Expand all**array<object>**
    

ReviewStatus

Collapse all**string**

Status of a code review.

Allowed values

- "started"
- "in_progress"
- "completed"
- "failed"

ValidationError

Collapse all**object**

- loc
    
    Expand all**array<(string | integer)>**
    
- msg
    
    **string**
    
- type
    
    **string**
```

## Requirements

We will be adding 2 new pages to the application, the 'Code Review Record Detail Page' and the 'Code Review List Page', and we will be updating the 'Home' page.

We would like to implement the following requirements:
## Home Page - submits a code review for processing

Update the current home page content and add a form with the following components:
- (Text Box) Repository URL - a valid web url that is the `repository_url`
- (Submit Button) 'Generate code review' button - Submits the form for processing

When the form is submitted, it calls the `POST /api/v1/code-reviews` API endpoint, passing the required `repository_url` from the text box.

The path to this page will be under the following route `/`

Upon reply from the endpoint, the web application will then be redirected to the 'Code Review Record Detail Page', using the newly created code review `_id` value as the id slug for the 'Code Review Record Detail Page'

### Code Review Record Detail Page - Prints the information relating to the selected code review record

Create a new page that will show the details for a given code review record.  The path to this page will be under the following route `/code-reviews/{id}` , with the {id} value being the `_id` value for the code review record we want to fetch and show details for.

Upon load, we should call the `GET /api/v1/code-reviews/{id}` API endpoint to get the information to display on the page.

The page should display the following information:
-  Code Repository
- CreatedAt Date/time in `yyyy-mm-dd HH:ii:ss` format (ISO)
- UpdatedAt Date/time in `yyyy-mm-dd HH:ii:ss` format (ISO)
- Status

Under the above information should be a 'tab' component that will be populated with the code review reports when available (work in progress).  Please add a placeholder tab container for now.

### Code Review List Page - List the current code review records

Create a new page to view code review records from the backend.  This page should add a new navigation item to the application called 'Code Reviews' that links to this new page.

The path to this page will be under the following route `/code-reviews`

This page will call the `GET /api/v1/code-reviews/` API endpoint on load.  We will use the contents of this call to populate a table with the following format:
- Code Repository
- CreatedAt Date/time in `yyyy-mm-dd HH:ii:ss` format (ISO)
- UpdatedAt Date/time in `yyyy-mm-dd HH:ii:ss` format (ISO)
- Status

The 'Code Repository' value in the table will link to the 'Code Review Record Detail Page', with the id for the record.

## Guidelines

You MUST follow the following guidelines when creating or updating pages:
- GOV.UK Design Principles - [https://www.gov.uk/guidance/government-design-principles](https://www.gov.uk/guidance/government-design-principles)
- GOV.UK Style guide (for content formatting guidance) - [https://www.gov.uk/guidance/style-guide](https://www.gov.uk/guidance/style-guide)
- GOV.UK Design System - [https://design-system.service.gov.uk/](https://design-system.service.gov.uk/)
- GOV.UK Design System Components - [https://design-system.service.gov.uk/components/](https://design-system.service.gov.uk/components/)
- GOV.UK Design System Patterns - [Patterns](https://design-system.service.gov.uk/patterns/)

These GOV standards will be implemented using the `govuk-frontend` library along with `nunjucks` .  YOU MUST use these libraries when choosing component to include in the page layout.

We will be following progressive enhancement principles:
	- Use vanilla JavaScript; avoid TypeScript.
	- Do not use front-end frameworks like React, Angular, or Vue.
	- Ref: https://technology.blog.gov.uk/2016/09/19/why-we-use-progressive-enhancement-to-build-gov-uk/

## Technical note:
- It will be using hapi.js framework running on node.js