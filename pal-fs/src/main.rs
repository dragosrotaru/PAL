use std::os::raw::c_int;
use fuser::{Filesystem, Request, KernelConfig};

pub struct PalFS {
  
}

impl Filesystem for PalFS {
    fn init(
      &mut self,
      _req: &Request<'_>,
      _config: &mut KernelConfig
    ) -> Result<(), c_int> {
      return Ok(());
    }
    fn destroy(
      &mut self,
      _req: &Request<'_>) {
        return;
    }

    fn lookup(
      &mut self,
      _req: &Request<'_>,
      _parent: u64,
      _name: &std::ffi::OsStr,
      reply: fuser::ReplyEntry
    ) {

    }

    fn forget(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _nlookup: u64
    )
      {

    }

    fn getattr(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      reply: fuser::ReplyAttr)
      {

    }

    fn setattr(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _mode: Option<u32>,
      _uid: Option<u32>,
      _gid: Option<u32>,
      _size: Option<u64>,
      _atime: Option<fuser::TimeOrNow>,
      _mtime: Option<fuser::TimeOrNow>,
      _ctime: Option<std::time::SystemTime>,
      _fh: Option<u64>,
      _crtime: Option<std::time::SystemTime>,
      _chgtime: Option<std::time::SystemTime>,
      _bkuptime: Option<std::time::SystemTime>,
      _flags: Option<u32>,
      reply: fuser::ReplyAttr,
    ) {

    }

    fn readlink(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      reply: fuser::ReplyData
    ) {

    }

    fn mknod(
      &mut self,
      _req: &Request<'_>,
      _parent: u64,
      _name: &std::ffi::OsStr,
      _mode: u32,
      _umask: u32,
      _rdev: u32,
      reply: fuser::ReplyEntry,
    ) {

    }

    fn mkdir(
      &mut self,
      _req: &Request<'_>,
      _parent: u64,
      _name: &std::ffi::OsStr,
      _mode: u32,
      _umask: u32,
      reply: fuser::ReplyEntry,
    ) {

    }

    fn unlink(
      &mut self,
      _req: &Request<'_>,
      _parent: u64,
      _name: &std::ffi::OsStr,
      reply: fuser::ReplyEmpty
    ) {

    }

    fn rmdir(
      &mut self,
      _req: &Request<'_>,
      _parent: u64,
      _name: &std::ffi::OsStr,
      reply: fuser::ReplyEmpty
    ) {

    }

    fn symlink(
      &mut self,
      _req: &Request<'_>,
      _parent: u64,
      _name: &std::ffi::OsStr,
      _link: &std::path::Path,
      reply: fuser::ReplyEntry,
    ) {

    }

    fn rename(
      &mut self,
      _req: &Request<'_>,
      _parent: u64,
      _name: &std::ffi::OsStr,
      _newparent: u64,
      _newname: &std::ffi::OsStr,
      _flags: u32,
      reply: fuser::ReplyEmpty,
    ) {

    }

    fn link(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _newparent: u64,
      _newname: &std::ffi::OsStr,
      reply: fuser::ReplyEntry,
    ) {

    }

    fn open(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _flags: i32,
      reply: fuser::ReplyOpen
    ) {
        reply.opened(0, 0);
    }

    fn read(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _offset: i64,
      _size: u32,
      _flags: i32,
      _lock_owner: Option<u64>,
      reply: fuser::ReplyData,
    ) {

    }

    fn write(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _offset: i64,
      _data: &[u8],
      _write_flags: u32,
      _flags: i32,
      _lock_owner: Option<u64>,
      reply: fuser::ReplyWrite,
    ) {

    }

    fn flush(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _lock_owner: u64,
      reply: fuser::ReplyEmpty,
    ) {

    }

    fn release(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _flags: i32,
      _lock_owner: Option<u64>,
      _flush: bool,
      reply: fuser::ReplyEmpty,
    ) {
        reply.ok();
    }

    fn fsync(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _datasync: bool,
      reply: fuser::ReplyEmpty,
    ) {

    }

    fn opendir(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _flags: i32,
      reply: fuser::ReplyOpen
    ) {
        reply.opened(0, 0);
    }

    fn readdir(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _offset: i64,
      reply: fuser::ReplyDirectory,
    ) {

    }

    fn readdirplus(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _offset: i64,
      reply: fuser::ReplyDirectoryPlus,
    ) {

    }

    fn releasedir(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _flags: i32,
      reply: fuser::ReplyEmpty,
    ) {
        reply.ok();
    }

    fn fsyncdir(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _datasync: bool,
      reply: fuser::ReplyEmpty,
    ) {

    }

    fn statfs(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      reply: fuser::ReplyStatfs
    ) {
        reply.statfs(0, 0, 0, 0, 0, 512, 255, 0);
    }

    fn setxattr(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _name: &std::ffi::OsStr,
      _value: &[u8],
      _flags: i32,
      _position: u32,
      reply: fuser::ReplyEmpty,
    ) {

    }

    fn getxattr(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _name: &std::ffi::OsStr,
      _size: u32,
      reply: fuser::ReplyXattr,
    ) {

    }

    fn listxattr(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _size: u32,
      reply: fuser::ReplyXattr
    ) {

    }

    fn removexattr(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _name: &std::ffi::OsStr,
      reply: fuser::ReplyEmpty
    ) {

    }

    fn access(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _mask: i32,
      reply: fuser::ReplyEmpty
    ) {

    }

    fn create(
      &mut self,
      _req: &Request<'_>,
      _parent: u64,
      _name: &std::ffi::OsStr,
      _mode: u32,
      _umask: u32,
      _flags: i32,
      reply: fuser::ReplyCreate,
    ) {
    }

    fn getlk(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _lock_owner: u64,
      _start: u64,
      _end: u64,
      _typ: i32,
      _pid: u32,
      reply: fuser::ReplyLock,
    ) {

    }

    fn setlk(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _lock_owner: u64,
      _start: u64,
      _end: u64,
      _typ: i32,
      _pid: u32,
      _sleep: bool,
      reply: fuser::ReplyEmpty,
    ) {

    }

    fn bmap(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _blocksize: u32,
      _idx: u64,
      reply: fuser::ReplyBmap,
    ) {

    }

    fn ioctl(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _flags: u32,
      _cmd: u32,
      _in_data: &[u8],
      _out_size: u32,
      reply: fuser::ReplyIoctl,
    ) {

    }

    fn fallocate(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _offset: i64,
      _length: i64,
      _mode: i32,
      reply: fuser::ReplyEmpty,
    ) {

    }

    fn lseek(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      _fh: u64,
      _offset: i64,
      _whence: i32,
      reply: fuser::ReplyLseek,
    ) {

    }

    fn copy_file_range(
      &mut self,
      _req: &Request<'_>,
      _ino_in: u64,
      _fh_in: u64,
      _offset_in: i64,
      _ino_out: u64,
      _fh_out: u64,
      _offset_out: i64,
      _len: u64,
      _flags: u32,
      reply: fuser::ReplyWrite,
    ) {

    }

    fn setvolname(
      &mut self,
      _req: &Request<'_>,
      _name: &std::ffi::OsStr,
      reply: fuser::ReplyEmpty
    ) {

    }

    fn exchange(
      &mut self,
      _req: &Request<'_>,
      _parent: u64,
      _name: &std::ffi::OsStr,
      _newparent: u64,
      _newname: &std::ffi::OsStr,
      _options: u64,
      reply: fuser::ReplyEmpty,
    ) {

    }

    fn getxtimes(
      &mut self,
      _req: &Request<'_>,
      _ino: u64,
      reply: fuser::ReplyXTimes
    ) {

    }
}

fn main() {
    println!("Hello, world!");
}
