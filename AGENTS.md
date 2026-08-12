This is a local development server hosted at HOST env variable (please read config.env file). This project is hosted on docker compose for local development. When you make any changes to the codebase the container hot-reloads. Please make sure you wait for it to restart to test. If you need access to the database during development, credentials are in config.env file.

Things to keep in mind while developing:

Do not worry about circular dependencies. All the import should be on the top of the file.

### Migrations

#### Postgres

If you are doing any postgres migration. Please do not write migraton code manually, run npm run generate-postgres-migration instead.

After generating the migration file, you MUST also register it in `Common/Server/Infrastructure/Postgres/SchemaMigrations/Index.ts` — add the import at the top and append the class to the default export array. The migration will not run on app startup until it is registered there.

CI enforces this. The "Postgres Schema Drift" workflow migrates an empty database with every registered migration and then generates a migration against the result; anything it can still generate is drift and fails the job. Run the same check locally with `npm run check-postgres-schema-drift` — it prints the exact statements that are missing.

#### Clickhouse

Clickhouse migrations are written manually. Please write the migration code in DataMigrations and follow the same pattern as other migrations.

### After you make a change.

Please run "npm run fix" in root to fix all the lint issues. Please run "npm run compile" in projects that you made changes to make sure compile works.

### Project docs

Internal roadmaps live in `Internal/Roadmap/` (see its README for the index).

### Hotfix release builds

- Fetch `origin`, `upstream`, and tags before selecting a base. Use the newest stable semantic-version tag unless the user explicitly requests `master` or another ref.
- Verify whether the hotfix is already present in the selected base before porting it.
- Run build, compile, lint, and test tooling in Docker. Do not use the WSL host Node.js/npm installation for release validation.
- Generate Dockerfiles from `Dockerfile.tpl` with the project-pinned `gomplate` version in a container; do not run the interactive `configure.sh` installer merely to generate Dockerfiles.
- For an ObjectID hotfix, build and publish only the deployment images that need the release tag: `app`, the `oneuptime` alias of the same app image, `probe`, and `nginx`. Include another image only when its source exists in the selected version and the hotfix affects it. Do not build or publish secondary Compose images such as `home`, `e2e`, `runner`, `test-server`, `fluent-bit`, or `fluentd` unless explicitly requested.
- Publish hotfix images to `nexus-docker-hosted.setpartnerstv.ru/oneuptime/<image>:<version>-objectid-hotfix`.
- Push the hotfix branch and matching Git tag to `origin`; a local-only build is not a completed release build.
- After pushing, verify every remote image manifest digest, verify the branch is synchronized with `origin`, and ensure the working tree is clean.
