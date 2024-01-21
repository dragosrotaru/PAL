# HyperFS 2

## Configuration

### Environment Variables

- PASSWORD
- PRIVATE_KEY_FILE_PATH
- CONFIG_FILE_PATH
### Encryption

- a password-derived symmetric key is used to decrypt a RSA private key
- the private key is used to decrypt the config file
- the config contains a symmetric key used to decrypt data

### Configuration File (hyperconfig.json)

### Namespace Table

NameSpace
  name: NameSpaceName
  nodeList: { name: NodeName, id: NodeID }
  nodeListHash: Hash


CREATE NAME HASH
- user moves a file to fusemount
- client checks in-memory NAMESPACE and fails if name already exists
- client adds to in-memory NAMESPACE
- client encrypts file
- client stores file in LocalStorageDevice
- client broadcasts message to 
UPDATE NAME OLD_HASH NEW_HASH
DELETE NAME
RENAME OLD_NAME NEW_NAME

## Old Notes

- Implement mutable node namespace
- allow phone to store data on laptop harddrive StorageDevice (node as a StorageDevice)
- enable StorageDevice discovery via a centralized server
- S3 Permissions, Public StorageDevices and Public files

- set file persistance settings per file and/or per folder.
- persistance settings are inherited from parent nodes. They behave like union of sets.
- statistics:
  - average number of copies per file
  - offline coverage
  - number of interactions
  - bandwidth useage
- automatically set popular files to be available offline/made redundant
- automatically change offline coverage based on bandwidth/drive space/cost
- set mobile data/network useage restrictions/notifications

- persistance mediums are shared between nodes and are content addressable.

I want a folder that has the following properties:
  - every file added to it is stored encrypted
    - storage methods may vary to save space:
      - medium (different local drives, cloud, IPFS)
      - versioning format (delta, state, ops)
      - encoding
      - compression
  - every file has its own version history
    - file version history may have a variety of granularities:
        - per keyboard event (if in collaborative editor)
        - per save
        - per commit
    - files can be marked as belonging to a change group, which require a "commit" that behaves as follows:
      any time a file in the change group is modified in any way, the changes need to be commited in order
      to propagate to other nodes. 
    - files not marked as belonging to a change group will have their changes propagated immediately.
  - file versions can be tagged
  - file can be resolved by name or hash(es)
  - files can be browsed:
    - by title
    - by last modified
    - by format(?)
  - file namespace duplicates can be listed
  