//! pal-fs: FUSE filesystem implementation for the Pal environment.
//! PalFS implements the `fuser::Filesystem` trait — all methods are stubs (default ENOSYS).
//! The intent is to expose the Pal reactive environment as a virtual filesystem mountable via FUSE.
//! @author claude

use fuser::{Filesystem, KernelConfig, Request};
use std::io;

/// Stub FUSE filesystem. All inode operations use fuser's default ENOSYS implementations.
// todo @claude: implement lookup/read/write to proxy inode operations to/from the Pal Env
pub struct PalFS {}

impl Filesystem for PalFS {
    fn init(&mut self, _req: &Request, _config: &mut KernelConfig) -> io::Result<()> {
        Ok(())
    }
}

fn main() {
    println!("Hello, world!");
}
