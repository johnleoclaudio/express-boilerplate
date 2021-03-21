# PDAX AUTH SERVICE

## Getting started

### Prerequisites

This project requires that the developer has the following installed:

1. [Node.js](https://nodejs.org/en)
2. [Postgresql](https://www.postgresql.org/)

### Starting the web server

Yet to be updated...

### Running the tests

`npm test`

## Contributing

if one wants to contribute to this project, create a branch with an appropriate name that reflects the intention.
Then create a pull requeest with complete description of the changes made. Make sure to include appropriate testing.
A test coverage of 80% has to be maintained in order for a branch to be considered stable and valid.

### Code Review Check list

Things that need to be kept in mind when reviewing a contributor's work are but may not be limited to the following:

1. If it's a feature that corresponds to a user story, does it fulfill all the acceptance criteria?
2. If it's a bug fix, does the test replicate the actual scenario?
3. Does lint pass?
4. Are there breaking changes/failing tests?
5. Does the code follow coding guidelines?

### Coding Guidelines

#### Key Concepts

1. [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
2. [Inversion of Control](https://en.wikipedia.org/wiki/Inversion_of_control)
3. [Dependecy Injection](https://en.wikipedia.org/wiki/Dependency_injection)

#### Project Structure

```
- config
- src
  - db
  - features
  - services
  - interfaces
  - helpers
  index.ts
  types.ts
- migrations
- seeders
- tests
```

##### /src/db

Contains mostly the objects mapping to the database

##### /src/features

Contains the intended business rules and use cases.

##### /src/services

Contains code that has meaning in the process level but not exactly part of the core processes

##### /src/interfaces

Contains typescript interfaces

##### /src/helpers

Contains mostly convenience methods like boilerplate and formatting code

##### /migrations

Contains database migration scripts. Its automatic now.

##### /seeders

Contains database seed data

##### /tests

Contains integration tests

#### Testing

Unit tests should be placed beside the subject under test. Integration tests are to be placed in the `/tests` folder.
