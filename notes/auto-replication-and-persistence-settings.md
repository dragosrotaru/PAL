---
date: 2024-01-21
tags: [persistence, hyper-ts, replication, p2p, scratch]
---

# Persistence settings (HyperFS operational)

Per-file or per-folder settings, inherited from parent (union of sets):

- Persistence mediums are shared between nodes and content-addressable
- Popular files automatically set to offline/redundant
- Offline coverage auto-adjusts based on bandwidth/drive space/cost
- Mobile data/network usage restrictions and notifications

## Statistics per file

- Average number of copies
- Offline coverage
- Number of interactions
- Bandwidth usage

## Device/storage discovery

- Allow phone to store data on laptop StorageDevice (node as StorageDevice)
- StorageDevice discovery via centralized server
- S3 permissions, public StorageDevices and public files
