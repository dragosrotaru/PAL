# HyperFS 4

## Script 1
- copies all of the files matching a filepath pattern to the local file store using hash as key.
- append hashes to "unorganized", fileType  and optionally any other edge (tag) provided as user input.
- produce list of existing nodes/edges (rare) and offer option to cancel or skip.
- option to use filename as namespace or ignore filenames, with namespace collisions indicated.
- option to encrypt before pushing to remotes.
- push nodes and edges to remotes with timestamp metadata.
  1. FileCoin
  2. Amazon S3 Bucket (2 Regions)
  3. My Own Server
  4. My Own IPFS Node
- produce batch-job object with upload outcomes, time stats, hashes, urls.
- push batch-job to remotes.
- produce new namespace.
- push namespace to remotes.
- email namespace deets.

## Script 2
- periodically checks the health of remotes and notify if there is an issue.

## Script 3
- allow a node to be added to an edge by hash or name.
- allow all nodes in an edge to be added to another edge.
- allow all nodes in an edge to be selectively added to another edge. 

## Script 4
- watch two drop box directories (encrypted, unencrypted) and automatically upload to file stores then delete.
- add to unorganized tag.

## Script 5
- allow me to instantiate or load a namespace in a root folder after selecting a projection onto the filesystem.
- automatically sync changes to the file stores on every edit.
- allow me to name the current state of the filesystem (create a new branch or commit to an existing branch).
- mirror onto github.

## Script 6
- allow me to garbage collect unnamed nodes/edges.

## Beyond
- allow me to share nodes/edges.
- allow me to co-edit a node/edge.
- allow me to co-edit a namespace.
- allow me to trigger rebuilds on remotes by simply updating a name (this will require subscriptions)
- break out of file paradigm.