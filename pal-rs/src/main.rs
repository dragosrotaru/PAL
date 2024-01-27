use pal::{from_filesystem, parse, compile};

fn main() {
    let args: Vec<String> = env::args().collect();
    let path = &args[1];
    let files = from_filesystem(path);
    println!("{:?}", files);
    let asts = files.iter().map(|file| parse(file));
    // todo output to rust files
    compile(asts);
}