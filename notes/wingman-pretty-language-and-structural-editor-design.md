---
date: 2024-01-21
tags: [wingman, language-design, structural-editor, pretty-dsl, ast, rust, macros]
summary: Design notes for the Wingman structural editor's language layer. Includes a concrete example of the `.pretty` DSL applied to a todo app (data types + component layout with reactive bindings like `@todo.completed`). Core thesis: the editor language is a loose Rust superset with its own AST — it does not need to match Rust's AST (analogous to rust-analyzer's approach). Multiple sub-languages can coexist (like Pal). Compilation is macro-driven: the AST representation can evolve over time with a migration strategy for CRDT data. Important because it defines how code will be authored and compiled in Wingman, linking the pretty DSL to the broader Pal vision.
---

# Wingman: pretty language and structural editor design

## Todo app example

Data model:
```
Category {
    name: string,
    icon: emoji,
}
Todo {
    name: string,
    completed: boolean,
    category: string,
    due_date: datetime,
}
```

Component layout (`.pretty` DSL):
```
Todo : Block [
    ... style properties;
    Block [
        Checkbox [
            on_click: () => @todo.completed = ! @todo.completed;
        ]
        Name : Text [ @todo.name ]
        Category : Text [ @todo.category @todo.icon ]
        DueDate: Text [
            color: if @todo.due_date.is_overdue() : red : @theme.grey;
            @todo.due_date.to_display_format()
        ]
    ]
]

Todos [
    @todos sort ( ) map Todo
]
```

## Design principles

- The first target is to be able to write a subset of Rust
- A structural editor requires an AST representation of the code — this AST does not need to match the underlying language's AST (see: rust-analyzer)
- The Wingman language is a loose superset of Rust but is not Rust
- The AST can be represented with whatever fidelity is needed to implement new features
- A migration strategy for the AST and CRDT data is required as the representation evolves
- Multiple sub-languages can coexist in the system — analogous to how Pal is conceptualized
- **Compilation is macro-driven**: the way code compiles is dictated by the Macro
