## Overview
  Boilerplate for Node.js projects using Express.js with TypeScript and TypeORM

## 💬 Before Start Developing
  * If you won't use MySQL, remove the driver from the dependencies: `npm uninstall mysql` and install the desired database driver
  * Create a database named `${DB_NAME}` (variable from env)
  * And create a database to run the tests `${DB_NAME}_test`

### 📝 Commands
  * Start server in development mode: `npm run dev`
  * Run tests: `npm test`
  * Run linter and autofix fixable errors: `npm run lint`
  * Run migrations: `npm run typeorm migration:run`
  * Generate migration: `npm run typeorm migration:generate -- -n CreateModelName`
  * Create migration: `npm run typeorm migration:create -- -n CreateModelName`
  * Revert last migration: `npm run typeorm migration:revert`

---

<div align="center">Made with 💖 by [HOX](https://www.hox.rs)</div>
