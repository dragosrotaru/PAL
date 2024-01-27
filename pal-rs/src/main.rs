use std::env;

use pal_rs::{from_filesystem, parse, compile};
use pal_rs::ast::AST;

fn main() {
    let args: Vec<String> = env::args().collect();
    let path = &args[1];
    let files = from_filesystem(path);
    let asts: Vec<AST> = files.into_iter().map(|file| parse(file).unwrap()).collect();
    // todo output to rust files
    compile(asts);
}