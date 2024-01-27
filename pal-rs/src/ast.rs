use syn::parse::Parse;
use quote::ToTokens;

pub trait AST: Parse + ToTokens {}