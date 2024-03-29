# JumprPak

Welcome to JumprPak with the intention of giving you a jumpstart on building the endpoints that actually matter to your application, or at least get closer to it. This is basically something to provide a good starting point by using patterns and solutions for authentication, database connection, email, and validation.

## MySQL Database Migration

Located in the `migrations` directory, there is a tables directory that contains the SQL files for all tables. This migrations will be run in the `docker-compose` file. The SQL can also be used to be run manually.

### Technologies Used

- Node
- TypeScript
- Express
- MySQL
- Yarn

### Path Aliases

Path aliasing has been set up to use the `_` character to refernce internal portions of the repository.

Files where aliases are setup:

- `tsconfig.json`
- `package.json`

**NOTE:** Feel free to contribute if you'd like as this is a basic work in progress.
