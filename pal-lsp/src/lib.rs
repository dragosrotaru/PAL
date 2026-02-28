//! pal-lsp library crate.
//!
//! Exports the parser and LSP analysis modules consumed by the server binary (`main.rs`).
//! The binary owns the tower-lsp `Backend`; this crate owns the language-specific logic.
//!
//! # Module layout
//!
//! | Module | Purpose |
//! |--------|---------|
//! | `chumsky` | Lexer, AST, parser, and type-inference for the "Foo/Pal" language (chumsky) |
//! | `completion` | Context-aware completion items derived from the AST |
//! | `jump_definition` | Go-to-definition: resolves an offset to a declaration site |
//! | `reference` | Find-all-references: collects every use of a declared symbol |
//! | `semantic_token` | Semantic token classification for syntax highlighting |

pub mod chumsky;
pub mod completion;
pub mod jump_definition;
pub mod reference;
pub mod semantic_token;
