use std::fs;
use quote::ToTokens;
use syn::Error;
use crate::ast::AST;

pub mod ast;
pub mod pretty;

pub struct File {
    path: String,
    ext: String,
    content: String,
}

/** takes a folder path and returns all files nested in it. panics  */
pub fn from_filesystem(path: &str) -> Vec<File> {
    let mut files = Vec::new();
    let paths = fs::read_dir(path).unwrap();
    for path in paths {
        let path = path.unwrap().path();
        let ext = path.extension().unwrap().to_str().unwrap().to_string();
        let content = fs::read_to_string(path.clone()).unwrap();
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
pub fn parse(file: File) -> Result<AST, Error> {
    match file.ext.as_str() {
        "pretty" => {
            let component = pretty::parse(file.content.to_token_stream())?;
            Ok(AST::Component(component))
        },
        _ => panic!("Unsupported extension"),
    }
}

/**
 Take ASTs and does the magic, turning it into rust code.
 Calls the compiler on the rust code.
*/
pub fn compile(ast: Vec<AST>) {
    
}