# Execution

Writing Wingman, I want to implement the UI as .pretty files.
These files need to be built. I can run rustc and trigger build.rs, 
importing the code with include!(). Alternatively, I can run pal-rs,
and run rustc as part of that.

I think for the first version, its easier to use build.rs.