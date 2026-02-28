---
date: 2024-01-21
tags: [namespace, hyper-ts, schema, scratch]
---

# Namespace table schema (HyperFS)

```
NameSpace
  name: NameSpaceName
  nodeList: { name: NodeName, id: NodeID }
  nodeListHash: Hash
```

## Operations (FUSE write flow)

1. User moves file to FUSE mount
2. Client checks in-memory NAMESPACE — fails if name exists
3. Client adds to in-memory NAMESPACE
4. Client encrypts file, stores in LocalStorageDevice
5. Client broadcasts one of:
   - `UPDATE NAME OLD_HASH NEW_HASH`
   - `DELETE NAME`
   - `RENAME OLD_NAME NEW_NAME`
