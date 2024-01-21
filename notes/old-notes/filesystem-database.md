# HyperFSDB

## The Data Persistance Status Quo

This image is useful: https://upload.wikimedia.org/wikipedia/commons/f/fb/The_Linux_Storage_Stack_Diagram.svg

- userland applications interact with database via inter-process communication
- database (RDBMS, NoSQL, etc) runs in userspace and interacts with VFS via system calls
- VFS calls filesystem ABI (ext4, xfs, etc) and there is some fuckery with Page Cache
- filesystem interacts with Device Mapper and Logical Volume Manager (LVM) via Block IO (BIO)
- Device Mapper/LVM interacts with Block Layer or directly to Physical Layer, or SCSI low level drivers
- Block Layer to SCSI low level drivers or to Physical Devices
- Physical Devices have controllers with multiple memory blocks and caching

On top of this, we have the network, which may look like:

- A web browser caching data via http directives
- A web browser application caching data via HTM5 persistance APIs
- A distributed database shards data across multiple instances on multiple machines
- An application caching layer caches data in memory

## Issues

- databases are a form of nexus rejection - they overlay the filesystem to provide added functionality,
without adhering to the filesystem API. interacting with the files owned by a running database is not allowed.
- database Durability (D in ACID) is not achieved in practice
- the performance tradeoffs in space and time are limited by the number of layers in the stack.
- the stack is not user-centric. data is not controlled by the user, it is controlled by the system.

## Solution

- HyperFSDB runs in userland. it provides:
  - FUSE filesystem API
  - Application-Embedded API
  - Network Endpoint API
  - Web Client
  - Command Line Interface
- HyperFSDB stores end-user data on the end-user's machine


## Resources

- Database as Filesystem (MySQLFS): https://www.youtube.com/watch?v=wN6IwNriwHc

