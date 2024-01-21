// @ts-ignore
import Fuse from "fuse-native";
import type { Device } from "../device";
import { FilePath } from "../file/path";

// const uid = process.getuid();
// const gid = process.getgid();

type Path = string;
type Mode = string;
type FileDescriptor = number;
type Size = number;
type Position = number;
type Flags = string;
type Name = string;
type AttrValue = string;
type DataSync = string;
type UID = number;
type GID = number;
type Dev = string;
type Time = string;

type Callback = (code: number) => void;
type DataCallback = (code: number, data?: any) => void;

const DEVICE = 16777220; // device 100000004 in octal (1,4)
const BLOCK_SIZE = 4096;

/* 

- does inode get automatically managed?
- does device get automatically managed?
- blocksize?

*/

/* 
http://fuse.sourceforge.net/doxygen/structfuse__operations.html
In general the callback for each op should be called with `cb(returnCode, [value])` where the return code is a number (`0` for OK and `< 0` for errors). See below for a list of POSIX error codes.
*/
export class FuseHandlers {
  private uid = process.getuid();
  private gid = process.getgid();
  constructor(private device: Device) {}
  // Called on filesystem init.
  init(callback: Callback) {
    console.log("init");
    process.nextTick(callback, 0);
  }
  // Called before the filesystem accessed a file
  access(path: Path, mode: Mode, callback: Callback) {
    console.log(`access ${path} ${mode}`);
    process.nextTick(callback, 0);
  }
  // Called when the filesystem is being stat'ed. Accepts a fs stat object after the return code in the callback.
  statfs(path: Path, callback: DataCallback) {
    console.log(`statfs ${path}`);
    callback(0, {
      bsize: BLOCK_SIZE, // Optimal transfer block size
      blocks: 4096, // Total data blocks in filesystem
      bfree: 4096, // Free blocks in filesystem
      bavail: 4096, // Free blocks available to unprivileged user
      files: 0, // Total inodes in filesystem
      ffree: 4096, // Free inodes in filesystem
      namemax: 256, // maximum name length
      frsize: 1024, // fragment size

      // Apparently ignored according to fuselib docs
      fsid: 0, // filesystem id
      flag: 0, // Mount flags of filesystem
      favail: 0,
    });
  }
  // Called when a path is being stat'ed. Accepts a stat object (similar to the one returned in `fs.stat(path, cb)`) after the return code in the callback.
  getattr(path: Path, callback: DataCallback) {
    try {
      const filePath = new FilePath(path);
      console.log(`getattr ${path}`);
      const date = new Date();
      if (filePath.isDirectory) {
        return process.nextTick(callback, 0, {
          size: 0,
          blocks: 0,
          mode: 16877, // mode 0040775
          birthtime: date, // created at
          atime: date, // accessed at
          mtime: date, // content modified at
          ctime: date, // file modified at
          dev: DEVICE,
          uid: this.uid, // userid and name of owner
          gid: this.gid, // groupid and name of owner
          blksize: BLOCK_SIZE, // block size
          rdev: 0, // special file device
          ino: 23490832, // inode number (this may or may not be safe to use)
          nlink: 2, // number of hard links (1 only makes sense for a file I guess)
        });
      } else {
        const file = this.device.getFileFromFilePath(new FilePath(path));
        return process.nextTick(callback, 0, {
          size: file.id.bytes,
          blocks: file.id.bytes / 512,
          mode: 33188, // mode 0100644
          birthtime: date, // created at
          atime: date, // accessed at
          mtime: date, // content modified at
          ctime: date, // file modified at
          uid: this.uid, // userid and name of owner
          gid: this.gid, // groupid and name of owner
          dev: DEVICE,
          blksize: BLOCK_SIZE, // block size
          rdev: 0, // special file device
          ino: 0, // inode number (this may or may not be safe to use)
          nlink: 1, // number of hard links (1 only makes sense for a file I guess)
        });
      }
    } catch (error) {
      process.nextTick(callback, Fuse.ENOENT);
    }
  }
  // Same as above but is called when someone stats a file descriptor
  fgetattr(path: Path, fileDescriptor: FileDescriptor, callback: DataCallback) {
    console.log(`fgetattr ${path} ${fileDescriptor}`);
    process.nextTick(callback, 0, {
      /* dev: 16777220,
      mode: 33188,
      nlink: 1,
      uid: 501,
      gid: 20,
      rdev: 0,
      blksize: 4096,
      ino: 114286931,
      size: 7394,
      blocks: 16,
      atimeMs: 1620097086349.1685,
      mtimeMs: 1620097084969.6306,
      ctimeMs: 1620097084969.6306,
      birthtimeMs: 1620077667424.5864,
      atime: 2021-05-04T02:58:06.349Z,
      mtime: 2021-05-04T02:58:04.970Z,
      ctime: 2021-05-04T02:58:04.970Z,
      birthtime: 2021-05-03T21:34:27.425Z */
    });
  }
  // Called when a file descriptor is being flushed
  flush(path: Path, fileDescriptor: FileDescriptor, callback: Callback) {
    console.log(`flush ${path} ${fileDescriptor}`);
    process.nextTick(callback, 0);
  }
  // Called when a file descriptor is being fsync'ed.
  fsync(
    path: Path,
    fileDescriptor: FileDescriptor,
    datasync: DataSync,
    callback: Callback
  ) {
    console.log(`fsync ${path} ${fileDescriptor} ${datasync}`);
    process.nextTick(callback, 0);
  }
  // Same as above but on a directory
  fsyncdir(
    path: Path,
    fileDescriptor: FileDescriptor,
    datasync: DataSync,
    callback: Callback
  ) {
    console.log(`fsyncdir ${path} ${fileDescriptor} ${datasync}`);
    process.nextTick(callback, 0);
  }
  // Called when a directory is being listed. Accepts an array of file/directory names after the return code in the callback
  readdir(path: Path, callback: DataCallback) {
    console.log(`readdir ${path}`);
    process.nextTick(callback, Fuse.ENOENT);
  }
  // Called when a path is being truncated to a specific size
  truncate(path: Path, size: Size, callback: Callback) {
    console.log(`truncate ${path} ${size}`);
    process.nextTick(callback, 0);
  }
  // Same as above but on a file descriptor
  ftruncate(
    path: Path,
    fileDescriptor: FileDescriptor,
    size: Size,
    callback: Callback
  ) {
    console.log(`ftruncate ${path} ${fileDescriptor} ${size}`);
    process.nextTick(callback, 0);
  }
  // Called when a symlink is being resolved. Accepts a pathname (that the link should resolve to) after the return code in the callback
  readlink(path: Path, callback: DataCallback) {
    console.log(`readlink ${path}`);
    process.nextTick(callback, 0, "/");
  }
  // Called when ownership of a path is being changed
  chown(path: Path, uid: UID, gid: GID, callback: Callback) {
    console.log(`chown ${path} ${uid} ${gid}`);
    process.nextTick(callback, 0);
  }
  // Called when the mode of a path is being changed
  chmod(path: Path, mode: Mode, callback: Callback) {
    console.log(`chmod ${path} ${mode}`);
    process.nextTick(callback, 0);
  }
  // Called when the a new device file is being made.
  mknod(path: Path, mode: Mode, dev: Dev, callback: Callback) {
    console.log(`mknod ${path} ${mode} ${dev}`);
    process.nextTick(callback, 0);
  }
  /* 
    Called when extended attributes is being set (see the extended docs for your platform).
    Copy the `value` buffer somewhere to store it.
    The position argument is mostly a legacy argument only used on MacOS but see the getxattr docs
    on Mac for more on that (you probably don't need to use that).
  */
  setxattr(
    path: Path,
    name: Name,
    value: AttrValue,
    position: Position,
    flags: Flags,
    callback: Callback
  ) {
    console.log(`setxattr ${path} ${name} ${value} ${position} ${flags}`);
    process.nextTick(callback, 0);
  }
  /* 
    Called when extended attributes is being read.
    Return the extended attribute as the second argument to the callback (needs to be a buffer).
    If no attribute is stored return `null` as the second argument.
    The position argument is mostly a legacy argument only used on MacOS but see the getxattr docs
    on Mac for more on that (you probably don't need to use that).
  */
  getxattr(path: Path, name: Name, position: Position, callback: DataCallback) {
    console.log(`getxattr ${path} ${name} ${position}`);
    process.nextTick(callback, 0, Buffer.from("hello"));
  }
  /* 
    Called when extended attributes of a path are being listed.
    Return a list of strings of the names of the attributes you have stored as the second argument to the callback.
  */
  listxattr(path: Path, callback: DataCallback) {
    console.log(`listxattr ${path}`);
    process.nextTick(callback, 0, ["a", "b", "c"]);
  }
  // Called when an extended attribute is being removed.
  removexattr(path: Path, name: Name, callback: Callback) {
    console.log(`removexattr ${path} ${name}`);
    process.nextTick(callback, 0);
  }
  /* 
    Called when a path is being opened.
    `flags` in a number containing the permissions being requested.
    Accepts a file descriptor after the return code in the callback.
  */
  open(path: Path, flags: Flags, callback: DataCallback) {
    console.log(`open ${path} ${flags}`);
    const fileDescriptor = 0;
    process.nextTick(callback, 0, fileDescriptor);
  }
  // Same as above but for directories
  opendir(path: Path, flags: Flags, callback: DataCallback) {
    console.log(`opendir ${path} ${flags}`);
    const fileDescriptor = 0;
    process.nextTick(callback, 0, fileDescriptor);
  }
  /* 
    Called when contents of a file is being read.
    You should write the result of the read to the `buffer` and return
    the number of bytes written as the first argument in the callback.
    If no bytes were written (read is complete) return 0 in the callback.
  */
  read(
    path: Path,
    fileDescriptor: FileDescriptor,
    buffer: Buffer,
    length: number,
    position: Position,
    callback: DataCallback
  ) {
    console.log(
      `read ${path} ${fileDescriptor} ${buffer} ${length} ${position}`
    );
    process.nextTick(callback, 0, 0);
  }
  /* 
    Called when a file is being written to.
    You can get the data being written in `buffer` and you should return
    the number of bytes written in the callback as the first argument.
  */
  write(
    path: Path,
    fileDescriptor: FileDescriptor,
    buffer: Buffer,
    length: number,
    position: Position,
    callback: DataCallback
  ) {
    console.log(
      `write ${path} ${fileDescriptor} ${buffer} ${length} ${position}`
    );
    process.nextTick(callback, 0, 0);
  }
  // Called when a file descriptor is being released. Happens when a read/write is done etc.
  release(path: Path, fileDescriptor: FileDescriptor, callback: Callback) {
    console.log(`release ${path} ${fileDescriptor}`);
    process.nextTick(callback, 0);
  }
  // Same as above but for directories
  releasedir(path: Path, fileDescriptor: FileDescriptor, callback: Callback) {
    console.log(`releasedir ${path} ${fileDescriptor}`);
    process.nextTick(callback, 0);
  }
  // Called when a new file is being opened.
  create(path: Path, mode: Mode, callback: Callback) {
    try {
      console.log(`create ${path} ${mode}`);
      this.device.createNewFile(new FilePath(path));
      process.nextTick(callback, 0);
    } catch (error) {
      process.nextTick(callback, -1);
    }
  }
  // Called when the atime/mtime of a file is being changed.
  utimens(path: Path, atime: Time, mtime: Time, callback: Callback) {
    console.log(`utimens ${path} ${atime} ${mtime}`);
    process.nextTick(callback, 0);
  }
  // Called when a file is being unlinked.
  unlink(path: Path, callback: Callback) {
    console.log(`unlink ${path}`);
    process.nextTick(callback, 0);
  }
  // Called when a file is being renamed.
  rename(src: Path, dest: Path, callback: Callback) {
    console.log(`rename ${src} ${dest}`);
    process.nextTick(callback, 0);
  }
  // Called when a new link is created.
  link(src: Path, dest: Path, callback: Callback) {
    console.log(`link ${src} ${dest}`);
    process.nextTick(callback, 0);
  }
  // Called when a new symlink is created
  symlink(src: Path, dest: Path, callback: Callback) {
    console.log(`symlink ${src} ${dest}`);
    process.nextTick(callback, 0);
  }
  // Called when a new directory is being created
  mkdir(path: Path, mode: Mode, callback: Callback) {
    console.log(`mkdir ${path} ${mode}`);
    process.nextTick(callback, 0);
  }
  // Called when a directory is being removed
  rmdir(path: Path, callback: Callback) {
    console.log(`rmdir ${path}`);
    process.nextTick(callback, 0);
  }
}
