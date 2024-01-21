# Progrees

Today we intended to implement a module system of some sort in order to allow the user to define Components in separate files. These would then be agreggated and compilation rules would be applied.

We found out quickly that Rust does not make this easy. The best solution
That I have come up with so far is to use a component definition macro which works somewhat ok with RA, then use a build.rs script to parse the
macros and combine them into one mega macro, which can then be processed with a root macro and output the result to a generated lib.

There are a few issues with this idea:

first is that there is no chain of custody back to the original definition macros so when there is a compilation issue it would just show up in the build.rs output, or even worse if it didnt catch it in the generated code (which I would have to trace back somehow). That would then require me to build a language extension to parse some artifact from build.rs and show errors correctly. This wouldn't be in real-time since build.rs is on save, which adds another inconvenience.

The next big issue is that build.rs outputs go into the target folder which can only be imported from using include!() which just places the contents of that file into the current file. this is terrible ux, expecially with RA not being able to tell you nearly as much.

The integration of macros with rust analyzer isnt great to begin with but I should explore it more.

The entire rationale behind using macros is to avoid writing a language server.
But seeing the pain points in integrating my tooling together, Its starting to seem like maybe I need to look at the whole thing a different way.

I can challenge some assumptions:
- could I just have one big file with the entire UI? 
- could I write a virtual VSCode view of the code which breaks that file into separate ones?
- could I write a transpiler with a unique file extension that has its own importing syntax and embed rust inside of it somehow?

The idea of embedding rust in the language sort of makes sense, the issue I see with it is that since I want to primarily use observables, it breaks the immersion. 

Most of the logic you see in React for example has to do with managing state, there is a bit of other stuff but Its minor in comparison. most importantly the other stuff should just be done straight up in rust. build libraries which own observables, and you're good to go.

You have libraries which are depended on by the View later, then the view layer needs to be rendered. you can do stuff as follows:

pretty imports rust code. pretty is transpiled to rust code. rust code is compiled and ran.

The ideal behaviour would be that .pretty files import rust code, and the rust based compiler can read it pretty well. then it can allow certain things to be imported. it can provide autocomplete, but in the form that is appropriate for pretty. maybe by implementing a trait, we can determine if some code is importable, i.e. if its an Observable or a Service or something. 

The files would live side by side. And when you compile, the process is simple:

build.rs goes to rust, rust goes to binary. boom. Then the definitions are simple, the line between the systems is clear.

The question is, what tooling should I use for the AST? because using Rust AST provides certain benefits, writing my own provides some other ones. 

I think its best to use the Rust AST because if not i will have a whole lot more work cut out for me, plus I can learn an actually useful api.


