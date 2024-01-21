use proc_macro2::TokenStream;
use quote::ToTokens;
use syn::{
    parse::{Parse, ParseStream},
    token::Bracket, Ident, Result, Token, Error, LitStr, bracketed, spanned::Spanned,
};
use crate::property::{Property, PropertyIdent};

pub struct ComponentIdent {
    pub value: Ident,
}

impl ComponentIdent {
    pub fn new(name: Ident) -> Self {
        Self { value: name }
    }

    pub fn validate_chars(&self) -> Result<()> {
        for c in self.value.to_string().chars() {
            if !c.is_alphanumeric() && c != '_' {
                return Err(Error::new(self.value.span(), "Component name must be alphanumeric (or underscore)"));
            }
        }
        Ok(())
    }
    pub fn validate_capitalised(&self) -> Result<()> {
        if !self.value.to_string().chars().next().unwrap().is_uppercase() {
            return Err(Error::new(self.value.span(), "ComponentName must be capitalised"));
        }
        Ok(())
    }
    pub fn validate(&self) -> Result<()> {
        self.validate_chars()?;
        self.validate_capitalised()?;
        Ok(())
    }
}

impl Parse for ComponentIdent {
    fn parse(input: ParseStream) -> Result<Self> {
        let ident: Ident = input.parse()?;
        let name = ComponentIdent::new(ident);
        name.validate()?;
        Ok(name)
    }
}

impl ToTokens for ComponentIdent {
    fn to_tokens(&self, tokens: &mut TokenStream) {
        self.to_tokens(tokens)
    }
}


pub struct Component {
    pub name: ComponentIdent,
    pub inherit_from: Option<ComponentIdent>,
    pub properties: Vec<Property>,
    pub children: Vec<Component>,
}

impl Component {
    pub fn new(name: ComponentIdent) -> Self {
        Component {
            name,
            inherit_from: None,
            properties: Vec::new(),
            children: Vec::new(),
        }
    }

    pub fn no_duplicate_properties(&self) -> Result<()> {
        let mut keys = Vec::new();
        for property in &self.properties {
            if keys.contains(&property.key) {
                return Err(Error::new(property.key.value.span(), "Duplicate property"));
            }
            keys.push(property.key.clone());
        }
        Ok(())
    }

    pub fn inherits_from_different_component(&self) -> Result<()> {
        if let Some(inherit_from) = &self.inherit_from {
            if inherit_from.value == self.name.value {
                return Err(Error::new(inherit_from.value.span(), "Component cannot inherit from itself"));
            }
        }
        Ok(())
    }

    pub fn validate(&self) -> Result<()> {
        self.no_duplicate_properties()?;
        self.inherits_from_different_component()?;
        Ok(())
    }
}

impl Parse for Component {
    fn parse(input: ParseStream) -> Result<Self> {
        let name: ComponentIdent = input.parse()?;
        let mut component = Component::new(name);

        if input.peek(Token![:]) {
            let _ = input.parse::<Token![:]>()?;
            let inherit_from: ComponentIdent = input.parse()?;
            if !input.peek(Bracket) {
                return Err(Error::new(input.span(), "Expected a Bracket"));
            }
            component.inherit_from = Some(inherit_from);

        }
        if input.peek(Bracket) {
            let content;
            let _ = bracketed!(content in input);
            let mut child_found = false;
            while !content.is_empty() {
                if content.peek(Token![if]) {
                    let keyword = content.parse::<Token![if]>()?;
                    // todo handle if keyword
                    return Err(Error::new(keyword.span(), "if conditional Component not implemented yet"));
                    // continue;
                }
                if content.peek(LitStr) {
                    let literal:LitStr = content.parse()?;
                    literal.suffix();
                    // todo handle literal prefix syntax
                    return Err(Error::new(literal.span(), "String Literal not implemented yet"));
                }
                let fork = content.fork();
                let next:Ident = fork.parse()?;
                if next == "map" {
                    // todo handle map keyword
                    return Err(Error::new(next.span(), "map Component not implemented yet"));
                }
                if PropertyIdent::new(next.clone()).validate().is_ok() {
                    if child_found {
                        return Err(Error::new(next.span(), "Properties must come before children"));
                    }
                    let property: Property = content.parse()?;
                    component.properties.push(property);
                }
                if ComponentIdent::new(next).validate().is_ok() {
                    child_found = true;
                    let child: Component = content.parse()?;
                    component.children.push(child);
                }
            }
        }

        component.validate()?;
        Ok(component)
    }
}

impl ToTokens for Component {
    fn to_tokens(&self, tokens: &mut TokenStream) {
        self.to_tokens(tokens)
    }
}
