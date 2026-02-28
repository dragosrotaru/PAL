---
date: 2024-01-21
tags: [research, web-frameworks, typescript, fullstack, lowcode, nocode, blitz, nextjs, react]
summary: Survey of web frameworks from the perspective of eliminating TypeScript project setup boilerplate. Documents the pain of starting a new TS project (monorepo, gitignore, testing, CI/CD, SSR, tree-shaking, etc.) and evaluates full-stack frameworks (Blitz, Next.js, Hotwire, RedwoodJS, SolidJS, Svelte/Sapper) against it. Also catalogs existing Node.js backend frameworks (Sails, Meteor, NestJS, Feathers, etc.), NoCode/LowCode platforms (GrapesJS, Budibase, NoFlo, Retool, etc.), and a personal "ideal framework" sketch — a system that abstracts Platform, Process, Node/Client/Server, IPC, Persistence, Events, IAM, Model, View, Controller, Versioning, Testing, Linting, Deployment, and Rendering into a single coherent whole. Historically relevant as a snapshot of the web tooling problem that motivated Pal's unified environment approach.
---

# Web framework landscape: full-stack and low-code survey

## The problem with TypeScript project setup

Every new TypeScript project requires:

- Monorepo setup, `npm init`, `.gitignore`, `.nvmrc`
- TypeScript configuration
- React + Express setup
- Code sharing between backend and frontend
- Unit, integration, and e2e testing
- Documentation, linting, git pre-commit hooks
- CI/CD, migrations, staging/production/dev environments
- Tree shaking, SSR, SEO

## BFF layer alternatives

- [htmx](https://htmx.org/) — hypermedia-driven, minimal JS
- Blazor server-side
- Phoenix LiveView

## Top full-stack contenders (evaluated)

- [Blitz.js](https://blitzjs.com) — abstracts away the frontend/backend split entirely; TypeScript config, integration/e2e testing, pre-commit autofix, full CI/CD pipeline baked in
- [Next.js](https://nextjs.org)
- [Hotwire](https://hotwired.dev)
- [RedwoodJS](https://redwoodjs.com)
- [Razzle](https://razzlejs.org)
- [SolidJS](https://www.solidjs.com/)
- Sapper / Svelte
- Deno

## Existing Node.js backend frameworks

Full-featured:
- [Sails.js](https://sailsjs.com/)
- [Meteor](https://www.meteor.com/)
- [KeystoneJS](https://www.keystonejs.com/)
- [NestJS](https://nestjs.com/)
- [LoopBack](https://loopback.io/)
- [Feathers](https://feathersjs.com/)
- [AdonisJS](https://adonisjs.com/)

Medium:
- [ts.ed](https://tsed.io/)
- [Kretes](https://kretes.dev/)

Minimal:
- [Kaviar](https://www.kaviarjs.com/)
- [Typetron](https://typetron.org/)

Other: Gatsby, Next, Strapi, Prisma, Apollo, AlpineJS, Lit

## NoCode / LowCode platforms

- [GrapesJS](https://grapesjs.com/) — visual HTML builder
- [Blocks UI](https://blocks-ui.com/)
- [Budibase](https://www.budibase.com/)
- [NoFlo](https://noflojs.org/) — flow-based programming
- [Builder.io](https://www.builder.io/)
- [Camunda](https://camunda.com/) — process/workflow automation
- Retool
- QuickBase, WaveMaker, OutSystems, APEX (Oracle), Creatio, Appian, Procesio
- [RemakeTheWeb](https://remaketheweb.com/)
- Survey: https://blog.remaketheweb.com/no-code-and-low-code-tools-and-platforms/
- Awesome lowcode: https://github.com/taowen/awesome-lowcode

## Ideal framework sketch

A unified framework should abstract over all of:

- Platform, Process, Node/Client/Server
- IPC, Persistence, Events, Integrations
- Versioning, Migrations, A/B Tests, Feature Flags
- Visitors, Users, IAM
- Model, View, Controller
- Validation, Correctness
- Testing, Compiling, Linting, Deployment
- Platform-specific customizations
- State, Rendering, Caching
