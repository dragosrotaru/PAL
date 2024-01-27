use syn::{parse::{Parse, ParseStream}, Error};
use component::Component;
mod component;
mod property;
mod value;

pub fn parse(parse_stream: ParseStream) -> Result<Vec<Component>, Error> {
    let mut components: Vec<Component> = Vec::new();
    while !parse_stream.is_empty() {
        let component = Component::parse(parse_stream)?;
        components.push(component);
    }
    Ok(components)
}