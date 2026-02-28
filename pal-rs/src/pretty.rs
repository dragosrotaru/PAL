//! The "pretty" DSL parser. A component-based UI description language parsed via syn/proc_macro2.
//! Syntax: `ComponentName[:ParentComponent] [property value; ... ChildComponent [...]]`
//! check() is a stub — validation logic (circular refs, dependency graph) not implemented.
//! @author claude

use proc_macro2::TokenStream;
use syn::Error;
use component::Component;
pub mod component;
pub mod property;
pub mod value;

pub fn parse(tokens: TokenStream) -> Result<Component, Error> {
    let component = syn::parse2::<Component>(tokens)?;
    Ok(component)
}

/// Validates a set of parsed Components. Currently returns an empty error list (stub).
// todo @claude: implement dependency graph, circular reference detection, and inheritance flattening
pub fn check(components: Vec<Component>) -> Vec<Error> {
    let mut errors = Vec::new();

    // generate dependency graph

    // check for circular references

    // check external dependencies

    // flatten inheritance tree

    errors
}