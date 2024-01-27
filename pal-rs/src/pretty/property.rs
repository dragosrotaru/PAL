use proc_macro2::TokenStream;
use quote::ToTokens;
use syn::{
    parse::{Parse, ParseStream},
    Ident, Result, Token, Error, LitInt,
};

pub mod width;

#[derive(Debug, Clone, PartialEq)]
pub struct PropertyIdent {
    pub value: Ident,
}

impl PropertyIdent {
    pub fn new(name: Ident) -> Self {
        Self { value: name }
    }

    pub fn validate_chars(&self) -> Result<()> {
        for c in self.value.to_string().chars() {
            if !c.is_alphanumeric() && c != '_' {
                return Err(Error::new(self.value.span(), "Property name must be alphanumeric (or underscore)"));
            }
        }
        Ok(())
    }

    pub fn validate_lowercase(&self) -> Result<()> {
        if !self.value.to_string().chars().next().unwrap().is_lowercase() {
            return Err(Error::new(self.value.span(), "Property name must be lowercase"));
        }
        Ok(())
    }

    pub fn validate(&self) -> Result<()> {
        self.validate_chars()?;
        self.validate_lowercase()?;
        Ok(())
    }
}

impl Parse for PropertyIdent {
    fn parse(input: ParseStream) -> Result<Self> {
        let ident: Ident = input.parse()?;
        let name = PropertyIdent::new(ident);
        name.validate()?;
        Ok(name)
    }
}

impl ToTokens for PropertyIdent {
    fn to_tokens(&self, tokens: &mut TokenStream) {
        self.to_tokens(tokens);
    }
}

#[derive(Debug, Clone)]
pub struct PropertyValue {
    pub value: i32,
}

impl Parse for PropertyValue {
    fn parse(input: ParseStream) -> Result<Self> {
        let ident: LitInt = input.parse()?;
        // todo implement
        Ok(PropertyValue {
            value: ident.base10_parse::<i32>().unwrap(),
        })
    }
}

impl ToTokens for PropertyValue {
    fn to_tokens(&self, tokens: &mut TokenStream) {
        self.to_tokens(tokens);
    }
}


#[derive(Debug, Clone)]
pub struct Property {
    pub key: PropertyIdent,
    pub value: PropertyValue,
}

impl Parse for Property {
    fn parse(input: ParseStream) -> Result<Self> {
        let key: PropertyIdent = input.parse()?;
        let value: PropertyValue = input.parse()?;
        // todo handle brackets
        let _ = input.parse::<Token![;]>()?;
        Ok(Property { key, value })
    }
}