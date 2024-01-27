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

/** Check for errors */
pub fn check(components: Vec<Component>) -> Vec<Error> {
    let mut errors = Vec::new();

    // generate dependency graph

    // check for circular references

    // check external dependencies

    // flatten inheritance tree
    
    errors
}