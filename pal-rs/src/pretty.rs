use syn::{parse::{Parse, ParseStream}, Error};
use component::Component;
pub mod component;
pub mod property;
pub mod value;

pub fn parse(parse_stream: ParseStream) -> Result<Component, Error> {
    let component = Component::parse(parse_stream)?;
    if !parse_stream.is_empty() {
        return Err(Error::new(parse_stream.span(), "Expected end of file"));
    }
    Ok(component)
}