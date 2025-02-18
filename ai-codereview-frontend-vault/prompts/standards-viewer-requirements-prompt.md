We currently have a list of standard sets being displayed on the `/standards/standard-sets` .  We want to add new functionality to allow a user to click on a standard set name, then go to a page that lists the standards, along with their classifications, in a table.

The interface must use GOV.UK design standards and the GDS-compliant components found in the current application.

# Detailed Requirements

## New `/standards/standard-sets/{id}` page

- Create a new `/standards/standard-sets/{id}` page, where the `{id}` value is a valid standard set id.
- This page should This page should query the backend api on the `/api/v1/classifications` endpoint (reference the `/standards/standard-sets` page to understand current patterns on how to make calls to the backend api).  We will store the results of this api query so we can map the classification_ids to the classification names later in the page processing.
- This page should query the backend api on the `/api/v1/standard-sets/{standard_set_id}` endpoint (reference the `/standards/standard-sets` page to understand current patterns on how to make calls to the backend api)
	- The API query will return the standard set information, including the individual standards that are part of the standard set.  Example:
```
{  
  "name": "test standards",  
  "repository_url": "[https://github.com/ee-todd/test-standards-set](https://github.com/ee-todd/test-standards-set)",  
  "custom_prompt": "",  
  "_id": "6798dbb48b9fe7ea351d02a3",  
  "created_at": "2025-01-28T13:29:24.528000",  
  "updated_at": "2025-01-28T13:29:24.528000",  
  "standards": [
    {
      "_id": "6793749ed353ce01153327bb",
      "text": "# Java Coding Standards\n\n## 1. Naming Conventions\n- Use camelCase for variables, methods, and non-final fields.\n- Use PascalCase for class and interface names.\n- Constants should be in UPPERCASE_WITH_UNDERSCORES.\n- Avoid abbreviations and use meaningful names for readability.\n\n## 2. Indentation and Formatting\n- Use 4 spaces per indentation level; do not use tabs.\n- Place opening braces `{` on the same line as the declaration.\n- Limit line length to 100 characters.\n- Add a single blank line between methods and sections of code.\n\n## 3. File Structure\n- Each class or interface should reside in its own `.java` file.\n- Name files to match the public class or interface they contain.\n- Use package names to organize files into logical groups.\n\n## 4. Comments and Documentation\n- Use Javadoc comments for public classes, methods, and fields.\n- Use block comments (`/* */`) for detailed explanations and inline comments (`//`) sparingly.\n- Document the purpose, parameters, and return values of methods.\n\n## 5. Imports\n- Avoid wildcard imports (e.g., `import java.util.*`).\n- Group imports by:\n  1. Standard library imports\n  2. Third-party library imports\n  3. Project-specific imports\n- Separate each group with a blank line.\n\n## 6. Error Handling\n- Use exceptions for error handling.\n- Catch specific exceptions rather than `Exception` or `Throwable`.\n- Include meaningful messages when throwing or logging exceptions.\n- Use `try`-with-resources for handling closeable resources.\n\n## 7. Code Style\n- Follow the Oracle Code Conventions for the Java Programming Language.\n- Use tools like Checkstyle or SpotBugs to enforce standards.\n- Remove unused variables and imports.\n\n## 8. Testing\n- Use JUnit or TestNG for writing and running tests.\n- Structure tests in a `src/test/java` directory.\n- Name test classes with `Test` suffix, e.g., `UserServiceTest`.\n- Ensure unit tests are independent and repeatable.\n\n## 9. Collections and Streams\n- Use generics to ensure type safety in collections.\n- Prefer `for-each` loops or streams for iteration over collections.\n- Use `Optional` to avoid null pointer exceptions.\n\n## 10. Multithreading\n- Use thread-safe collections like `ConcurrentHashMap` for shared data.\n- Avoid manual thread management; use `ExecutorService` or higher-level abstractions.\n- Always synchronize shared mutable data.\n\n## 11. Performance\n- Avoid creating unnecessary objects.\n- Use StringBuilder for string concatenation in loops.\n- Profile and optimize performance-critical sections of the code.\n\n## 12. Version Control\n- Exclude `.class` and other build artifacts using `.gitignore`.\n- Write meaningful commit messages.\n- Follow a consistent branching strategy (e.g., GitFlow).\n\n## 13. Build and Dependencies\n- Use a build tool like Maven or Gradle for dependency management.\n- Define dependencies explicitly in `pom.xml` or `build.gradle`.\n- Avoid hardcoding version numbers; use a properties file if needed.\n",
      "repository_path": "java_coding_standards.md",
      "standard_set_id": "6793749ca3cf6891cb41f3e0",
      "classification_ids": [
        "67935eda361ba58e4bb051aa"
      ]
    }
  ]  
}
```

- At the top of the new page, list the standard set name and repository URL. Make the repository url clickable to launch a new page that takes you to the repository url website
- Add a block for the custom prompt.  Make the custom prompt hidden in an accordion component titled 'Custom Prompt'
- Add a table that loops over the list of standards the table rows should show:
	- The file name in the repository_path (clickable so that the user can open a new page to view the file)
	- An short excerpt of the first part of the standards text (in html, parsed from the markdown text returned from the api).  Make it so the user can expand to see the whole of the text.
	- The classification names by looking up the `classification_ids` classifications from the earlier query.  These should be displayed in a GDS-compliant tag format.

## Update the `/standards/standard-sets` page

- Update the `/standards/standard-sets` page to change the standard set name for each standard listed in the table to be clickable.  The link should go to the `/standards/standard-sets/{id}` page, passing the standard set id for each row in the table.