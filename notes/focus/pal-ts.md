# Scope

## Filesystem integration

- the namespace of the objects closely matches the filesystem
- most concrete objects are represented as a file or folder
- an object can be edited as a file or with the UI

Motivation: having native filesystem integration is absolutely essential because it allows users to use any other application they want to modify their data.
THis allows the application to be immediately useful even when the UI isn't fully fleshed out. This also confers the benefit of being able to easily outsource data
backups, syncing and versioning to other tools like github and syncthing, which are trusted and have massive userbase.

## Unified Language and Data Model

- all data is represented in a easy to understand AST
- the language provides simple manipulation mechanisms and a basic type system that an average person can understand
- a person can use natural language to query the data or write expressions in the lanugage

Motivation: having a powerful modelling paradigm that is homoiconic allows for powerful features which dont exist in any other tool on the market. Notion is not a no-code tool,
But it can be if you provide an intuitive system for people to build their own application.

We do not need an advanced type system, my experience with professionals working in TypeScript has me that the majority of web developers barely use the feature space of the
type system.

## UI Integration

- the UI is easily modifed, extended and customized
- the UI is a playground for creativity

## Sharing

- People should be able to publish their work to a website, to collaborate with others via github, and to safely publish and import data + code.

## Additional Integrations

There needs to be a mobile app, web extension, vs code integration, and ability to integrate other data sources with a connector library.

## Performance

The system should be very fast, nobody likes working with a slow computer.
