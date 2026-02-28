---
date: 2024-01-27
tags: [decision, wingman, pretty, build, rust]
---

# Wingman build strategy for .pretty files

Writing Wingman, I want to implement the UI as .pretty files.
These files need to be built. I can run rustc and trigger build.rs,
importing the code with include!(). Alternatively, I can run pal-rs,
and run rustc as part of that.

**Decision: use build.rs for the first version** — simpler, fewer moving parts.
