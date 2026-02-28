---
date: 2024-01-21
tags: [research, git, decentralized-storage, p2p, self-hosted, sync]
summary: Reference list of Git alternatives, extensions, and decentralized storage systems. Git extensions (git-annex for large files, git-lfs, git-secret for secrets, git-remote-gcrypt for encrypted remotes). Hosting alternatives (Gitea, GitLab). Decentralized/self-sovereign storage (Perkeep, Upspin, Unhosted, IndieWeb, Garage, Syncthing). Dolt (version-controlled SQL database). Relevant to Pal's goal of replacing centralized Git hosting with content-addressed P2P storage.
---

# Decentralized storage and Git alternatives

## Git hosting alternatives

- [Gitea](https://gitea.io) — self-hosted Git service
- [GitLab](https://gitlab.com) — self-hosted Git + CI/CD

## Git extensions

- [git-annex](https://git-annex.branchable.com/) — large file management outside git objects
- [git-lfs](https://git-lfs.com/) — large file storage
- [git-secret](https://git-secret.io/) — store encrypted secrets in git
- [git-remote-gcrypt](https://spwhitton.name/tech/code/git-remote-gcrypt/) — encrypted git remotes
- [VFS for Git](https://github.com/microsoft/VFSForGit) — virtual filesystem for git (monorepos)

## Decentralized / self-sovereign storage

- [Perkeep](https://perkeep.org/) — personal storage system (content-addressed, formerly Camlistore)
- [Upspin](https://upspin.io/) — global name space for files
- [Unhosted](https://unhosted.org/) — web apps without server-side data storage
- [IndieWeb](https://indieweb.org/) — personal web publishing
- [Garage](https://garagehq.deuxfleurs.fr/) — self-hosted S3-compatible object storage
- [Syncthing](https://github.com/syncthing/syncthing) — P2P file synchronization
- [Dolt](https://github.com/dolthub/dolt) — SQL database with git-style versioning
- [Keybase](https://keybase.io/) — encrypted storage + identity
