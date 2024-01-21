use syn::{parse::{Parse, ParseStream}, LitInt, Ident};
use syn::Result;

pub struct Pixel {
    pub value: u8,
}

impl Parse for Pixel {
    fn parse(input: ParseStream) -> Result<Self> {
        let lit: LitInt = input.parse()?;
        let value: u8 = lit.base10_parse()?;
        
        let unit: Ident = input.parse()?;
        if unit != "px" {
            return Err(syn::Error::new(unit.span(), "expected 'px' after the number"));
        }

        Ok(Pixel { value })
    }
}
