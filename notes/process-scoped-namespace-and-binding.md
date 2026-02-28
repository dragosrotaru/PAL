---
date: 2024-01-21
tags: [process, namespace, os, hyper-ts, access-control]
summary: A Unix-like process tree where each process owns a scoped namespace subtree, with explicit binding semantics (copy / bind-readonly / bind-readwrite / bind-writeonly / rename) for sharing state across process boundaries. Interesting because the `bind` primitive cleanly separates naming from ownership — a name can point to shared data with an independent access policy, which is a more principled model than Unix's mix of symlinks, permissions, and environment variables. Relates to how Pal's Env scoping and `extend()` work.
---

# Process-scoped namespace model

- Every `process` has exactly one `namespace`. A process named `bob_process` has a namespace named `bob_namespace`.
- Every `namespace` has a `root`. `bob_namespace` has root `bob_root`.
- `system_process` , `system_namespace` and `system_root` are special - there is exactly one of each for every `system`.
- Every other `namespace` exists within `system_namespace`, hence every `root` is a descendant of `system_root`.
- Any `process` can be a `parent_process`, creating a `child_process` which has a `child_namespace`, which must exist within `parent_namespace` and `child_root` as a child node of `parent_root`. The child can run the same `program`, or a different `program` within `parent_namespace`.
- A `process` may also clone itself or execute another `program` from within its namespace in its place. cloning results in a child with identical program and linked or copied namespace as its parent. cloning a process will also clone its children.
- executing results in a different program with the same namespace, while also terminating the parent.

- All processes have a `process_id` and children have a `parent_process_id`. These states are read-only.
- `processes` have `read` access to their entire `namespace` and `write` access to state they are the `owner` (or co-owner) of.
- `processes` share state in the following ways:
  - `copy source_name dest_name` - copying the state to the destination without maintaining any ownership over the destination state or name.
  - `bind source_name dest_name --read-only` - make the destination name point to the same data as the source_name, and allow child processes to read it only.
  - `bind source_name dest_name --read-and-write` make the destination name point to the same data as the source_name, and allow child processes to read and write to it.
  - `bind source_name dest_name --write-only` make the destination name point to the same data as the source_name, and allow child processes to write to it only.
  - `rename original_name new_name` - rename some data within your namespace.


```jsx
Namespace Management

system
	process_ids
		system (0)
		alice (1)
		bob (2)
		charlie (3)
	programs
		system
		alice
	children
		alice
			pid         (r)
			ppid        (r)
			programs    (r+w)
				bob
				charlie
			data        (r+w)
				doggies.csv
			children    (r+w)
				bob
					pid     (r)
					ppid    (r)
					io
						stdin (r)
						stdout(w)
				charlie
					pid     (r)
					ppid    (r)

Process Management

PID PPID PROCESS NAMESPACE
 0   0   system   system/
 1   0   alice    system/alice
 2   1   bob      system/alice/bob
 3   1   charlie  system/alice/charlie

Data Management

NAME OWNER

```
