# Framework

BFF LAYER
https://htmx.org/
Blazor server-side or Phoenix Live View

Currently I am using Typescript and every time I start a new project, I have to:

- monorepo
- npm init
- .gitignore, .nvmrc
- typescript
- react
- express
- code sharing backend/frontend
- unit testing, integration testing, e2e testing
- documentation
- linting
- git pre-commit hooks
- ci/cd
- migrations
- staging/production/development
- tree shaking
- ssr
- seo
- blah blah blah

There is so much shit you have to waddle through just to build some fucking features.

## Blitz

- no code sharing required! We've abstracted away the concept of frontend and backend.
  unless we want to share code between two services in a distributed system, in which
  case we could use nx, lerna or symlinks.
- typescript config
- integration/e2e testing
- documentation
- make sure pre-commit runs prettier/eslint autofix
- ci/cd
  - lint
  - compile
  - test
  - coverage threshold
  - deploy preview branch
  - deploy staging branch
  - deploy production branch


# Top contenders

- https://blitzjs.com
- https://nextjs.org
- https://hotwired.dev
- https://redwoodjs.com
- https://razzlejs.org
- https://www.solidjs.com/
- Sapper/Svelte
- Deno

## Investigate

- lots of options here: https://blog.remaketheweb.com/no-code-and-low-code-tools-and-platforms/
- https://github.com/taowen/awesome-lowcode
- no-code options
- decentralized/non-server based options
- non-JS Web Frameworks
- TS boilerplates


## Existing Frameworks

- https://sailsjs.com/
- https://www.meteor.com/
- https://www.keystonejs.com/
- https://nestjs.com/
- https://loopback.io/
- https://feathersjs.com/
- https://adonisjs.com/

Small
- https://tsed.io/
- https://kretes.dev/

Super Small
- https://www.kaviarjs.com/
- https://typetron.org/

gatsby.js
next.js
strapi.js
prisma.js
apollo.js
- https://alpinejs.dev/
- https://lit.dev/

## NoCode / LowCode Projects

- https://grapesjs.com/
- https://blocks-ui.com/
- https://www.budibase.com/
- https://noflojs.org/
- https://www.builder.io/
- https://commun.dev/
- https://camunda.com/
- https://www.quickbase.com/
- https://www.wavemaker.com/
- https://www.outsystems.com/
- https://apex.oracle.com/en/
- https://www.creatio.com/
- https://appian.com/
- https://procesio.com/
- https://remaketheweb.com/
- retool

## Framework idea

abstract over:

Platform
Process
Node/Client/Server
IPC
Persistance
Events
Integrations
Versioning/Migrations/AB Tests/Feature Flags
Visitors/Users/IAM
Model
View
Controller
Validation
Correctness
  Testing
  Compiling
  Linting
Deployment
Platform-specific Customizations
State
Rendering
Caching

