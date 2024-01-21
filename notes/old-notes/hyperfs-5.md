# HyperFS 5


Some explanation of how filesystems work and what Im implementing:

In linux you have filepaths "/a/b/c" which map to a data structure called a Dentrie that caches the relationship between a filepath and an inode (Index Node) ID like "4234088432".
This all happens at the Linux VFS (Virtual File System) level within the Kernel. The VFS can then process OS syscalls (like open(), write(), mkdir(), etc) made from Userland applications to a concrete filesystem like FAT, NTFS, EXT4, BPFS, etc.

These filesystems have the job of defining and storing Inode data structures which holds metadata info about each file/directory on the actual storage medium (RAM, Disk, SSD, a remote server, the "Cloud").
Inodes eventually resolve to data blocks on the storage medium, with multiple layers of indirection (pointers to pointers) to expand the capacity of an inode and allow large filesizes.

FUSE is a kernel module which to the kernel looks like another concrete filesystem, but in actuality provides an API back into Userland code to allow developers to create a filesystem without writing a linux kernel in C.

I'm writing this filesystem in NodeJS to prototype and Rust for performance.

The problem I'm trying to solve with this filesystem is:

Structuring software projects is difficult because there is no correct solution.
By the very nature of hierarchical file systems, software engineers must compromise and select some limited set of organizing principles.
Every set of organizing principles has pros and cons.

The solution is this:

Let there be a graph, where every file in your project to be a Node in a graph, and every dependency in your code between one file and another to be a unidirectional (pointed) edge between 2 nodes.

Then consider a simple graph

A -> B -> C
A -> D

Then lets project this graph onto a hierarchical file structure as such:

/Dir-A/
              File-A
              Dir-B/
                         File-B
                         Dir-C/
                                    File-C
              Dir-D/
                          File-D

We can achieve this in current filesystems, and this can be described by 2 organizing principles:

- Place every File X is in a Folder X.
- Place every dependency of File X as a sub-directory Folder-Y.

These two organizing principles provide us with two benefits:

One: (Shown in JavaScript Syntax)
- Every dependency declaration will be of the same form import X from "./Dir-X/File-X";.
- Even better, we can name all files index.js and then import dependencies in the form import X from "./X";.

And Two:
 - For any given piece of code in our software project, all direct dependencies will be visible in its immediate sub-directories.
- All indirect dependencies will be visible as descendants nested somewhere in the sub-directory structure.

This is a very attractive proposition as it eliminates the need to have multiple folders open when working on any given file in our project.
Now, what happens when we add a new dependency:

A -> B -> C
A -> D
A -> C

The organizing principles described above cannot provide a solution for this new dependency graph without doing one of the following in a standard unix filesystem:

1. copy /Dir-A/Dir-B/Dir-C/File-C to /Dir-A/Dir-C
2. soft link (hard links cannot point to directories) /Dir-A/Dir-B/Dir-C/File-C to /Dir-A/Dir-C
3. write your code in File-A such that it imports /Dir-A/Dir-B/Dir-C/File-C with  import C from "./B/C";.
4. re-write your code in FIle-B such that it imports from the parent directory with import C from "../../C";.

Copying C is clearly the worst solution as incurs the highest cost by violating the Don't Repeat Yourself principle. Copying files, the complexity and therefore the maintainability of the system increases exponentially with the size of the Graph.

Linking C appears to be a zero-cost solution for this particular example.

The two remaining choices compromise the universality of benefits afforded by our choice of organizing principles.