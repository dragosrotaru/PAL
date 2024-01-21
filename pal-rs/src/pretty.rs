mod component;
mod property;
mod value;

pub fn parse(parse_stream: ParseStream) -> crate::AST {
    let mut components = Vec::new();
    while !parse_stream.is_empty() {
        components.push(component::parse(parse_stream));
    }
    crate::AST::Pretty { components }
}