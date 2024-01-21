enum AST {
    Code(Code),
    Test(Test),
    Document(Document),
    Discussion(Discussion),
    Issue(Issue),
    Computation(Computation),
    Analytics(Analytics),
    List(Vec<AST>),
}

// Versioning
// Tags
// Type

// unit of code
struct Code {}

// documentation
struct Document {}

// conversation between agents
struct Discussion {}

// bug/task
struct Issue {}

// test case
struct Test {}

// saved values example
struct Computation {}

// profile data, i.e. speed, memory, invokations
struct Analytics {}
