use syn::{parse::{Parse, ParseStream}, LitInt, Token};
use syn::Result;

pub struct Percent {
    pub value: u8,
}

impl Parse for Percent {
    fn parse(input: ParseStream) -> Result<Self> {
        let lit: LitInt = input.parse()?;
        
        if input.parse::<Token![%]>().is_err() {
            return Err(syn::Error::new(lit.span(), "expected '%' after the number"));
        }
        let value: u8 = lit.base10_parse()?;
        Ok(Percent { value })
    }
}