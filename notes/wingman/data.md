- host - the device-os the program is running on
- peer_hosts - the device-os this host cooperates with

- user - an account representing a person
- peer_users - the contacts for this user

- workspace - a group of associated content
- peer_workspaces - the workspaces this workspace borrows/shares content with

- content - a unit of content


Like VS Code, there are settings and extensions to the IDE that are configured at the host, user and workspace level.
The user will seldom interact with host-level data directly.

Prophet can be distributed at a number of levels:

## source

Because Prophet source code is a binary format, source code version control and distribution is done within Prophet itself. you have the ability to normalize Prophet into a filesystem diff algorithm friendly format for backwards compatibility with git. However, the end goal is to replace the need for all developer tools, including Git. When Sharing source code within Prophet itself, you publish to the Source Discovery Registry. The Source Files are stored 
on your choice of Origin Server; this could be the source-depot.prophet server, or any number of other compatible depots, including your own. The source of truth is the Source Discovery Registry. all depots must be registered there in order to be connected to. of course you can host your own private source discovery registry as well.

Entities / Affordances:

SourceDiscoveryRegistry
SourceDepot

source add-registry
source add-depot
source registry publish
source registry search
source registry
source push
source normalize // for git (or cargo also?)

## binary

the binary storage format is going to be portable, but of course the executable is not, except for wasm.

distributing the binary is straight forward, I dont know if Prophet needs a built-in binary distribution mechanism
since there are already enough channels already. I guess if you wanted to provide a data sovereignty layer built-in 
for end user data, then the idea of an app store would make some sense.

## Service

prophet could also be a hosting/deployment platform.

You have this new way of making software, that is accessible to more people. Perhaps you can add a monetary layer:

- Any time you run a piece of code, you pay royalties to the author and fees to the compute provider. If you use local compute or have access to some remote compute with out-of-band agreements, of course you dont pay anything. It is an opt-in economy.

You own any piece of code you write, including if the code is produced by a synthesis technique like LLM code gen.

Running the LLM means you might need to pay royalties to the LLM creator. Any training data that went into the LLM
will also need to be paid for by the creator, unless the data was donated or in the public domain. Again, this is opt-in.

So people can create apps, and these apps have codebases which can borrow from each other. If you write a unit of code, your account has ownership over it. if someone else copies and pastes the code, it can be recognized by a hashing function. 

How do you agree to how much value each dependency should have attributed?

I guess we have to also ask the question, how much of the functionality implemented at the lowest level would be monetized by creators? Would people monetize a Linked List implementation? I guess so, if it was more efficient than other implementations. What if AI can use genetic algorithms to optimize by switching out implementations?

What if you didnt want to engage in the profit sharing at all? 

I guess someone could use the tool, write some code, share it and only start collecting money once they opt-in. If they dont opt-in, they donate their profits to the Prophet organization.

Are there obligations on opt-in? I guess we can make the rule that a software-registry is a syndicate of creators who have opted into a shared profit scheme, As such, every piece of software in the registry has to meet some requirements - licensing, open source, exclusivity, ...?

A software registry could be an entire company, a consortium of companies, a traditional-style public heterogenous registry like github, a group of indie devs, etc. As such, each software registry is responsible for its own governance. 

So you have a universal CRDT-AST format, the ability to publish source code, binary or a service, the ability to depend on others' published source code, binaries or services, the ability to track and optimise the use of code, the ability to buy into a collaborative code sharing ecosystem with a collective profit sharing scheme, or any other scheme.

You could even say that the AST format and compiler is attached to the software registry itself. Since you cannot easily change a compiler without breaking backward-compatibility. Collective action is important. 

Some remaining questions:

so say you track invocations of a function, and that will attribute some value to a function's creator. what if someone annotates it with documentation or test cases? What if someone updates it with better code? How is that handled?

I think that the initial creator of the function has complete ownership over it. Someone can write a function that is exactly the same, and it would have the same hash. If that happens, the software registry rules can decide what to do.
The governance structure is completely dependent on the registry. 

The platform (prophet) is its own registry and ecosystem. Any registry which exists and wishes to make use of the mechanisms or services built into the platform may have to pay the platform.

You have an Abstract Syntax Tree. 






