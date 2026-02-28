//! Width property parser: accepts `width <px | %>`. Currently unused — not integrated into Property parsing.
//! @author claude
// todo @claude: Width struct is not used in property.rs parsing; wire it in as a special-case property handler
use proc_macro2::Ident;
use syn::{parse::{Parse, ParseStream}, Error};

use super::super::value::{pixel::Pixel, percent::Percent};

pub enum WidthValue {
    Pixel(Pixel),
    Percentage(Percent),
}

impl Parse for WidthValue {
    fn parse(input: ParseStream) -> Result<Self, Error> {
        let fork = input.fork();
        if fork.parse::<Pixel>().is_ok() {
            return Ok(WidthValue::Pixel(input.parse()?));
        } else if fork.parse::<Percent>().is_ok() {
            return Ok(WidthValue::Percentage(input.parse()?));
        }
        Err(Error::new(input.span(), "Invalid width value"))
    }
}

struct Width {
    pub key: Ident,
    pub value: WidthValue,
}

impl Parse for Width {
    fn parse(input: ParseStream) -> Result<Self, Error> {
        let key: Ident = input.parse()?;
        if key != "width" {
            return Err(Error::new(key.span(), "Expected 'width' key"));
        }

        let value: WidthValue = input.parse()?;
        Ok(Width { key, value })
    }
}
