//! Native entry point for the Prophet application. Blocks on the async run() event loop.
//! For WASM builds, wasm_bindgen(start) on lib.rs::run() serves as the entry point instead.
//! @author claude

use prophet::run;

fn main() {
    pollster::block_on(run());
}
