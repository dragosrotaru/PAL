//! AST root type for the Pal compiler. Currently only supports the `pretty` Component dialect.
//! @author claude

use crate::pretty::component::Component;

/// Top-level AST node. Currently only `Component` variant (from `.pretty` files) is supported.
// todo @claude: add additional AST variants for PAL s-expressions and other file types when parsers are added
pub enum AST {
    Component(Component),
}