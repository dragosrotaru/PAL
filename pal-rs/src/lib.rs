use std::fs;
use syn::parse::{Parse, ParseStream};
use proc_macro::TokenStream;
use quote::ToTokens;

mod pretty;

pub trait AST: Parse + ToTokens {}

pub struct File {
    path: String,
    ext: String,
    content: String,
}

// takes a folder path and returns all files nested in it
pub fn from_filesystem(path: &str) -> Vec<File> {
    let mut files = Vec::new();
    let paths = fs::read_dir(path).unwrap();
    for path in paths {
        let path = path.unwrap().path();
        let ext = path.extension().unwrap().to_str().unwrap().to_string();
        let content = fs::read_to_string(path).unwrap();
        files.push(File {
            path: path.to_str().unwrap().to_string(),
            ext,
            content,
        });
    }
    files
}

/**
 Takes a file and parses it into a token stream,
 followed by a parse stream, and finally an AST.
 Applies the correct parser based on the file extension.
 */
pub fn parse(file: File) -> AST {
    // todo this should use a different parsing method per extension
    let tokens = file.content.parse::<TokenStream>().unwrap();
    let parse_stream = ParseStream::new(tokens);
    match file.ext.as_str() {
        "pretty" => pretty::parse(parse_stream),
        _ => panic!("Unsupported extension"),
    }
}

/**
 Take ASTs and does the magic, turning it into rust code.
 Calls the compiler on the rust code.
*/
pub fn compile(ast: Vec<AST>) {

}