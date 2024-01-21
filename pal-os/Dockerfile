FROM ubuntu:20.04

RUN echo "Part II: Preparing for the build"

RUN echo "2. Preparing the Host system"

RUN echo "Installing required packages"
# set timezone for tzdata to install without interactive prompt
RUN ln -fs /usr/share/zoneinfo/America/New_York /etc/localtime
RUN apt-get update && apt-get install -y \
    build-essential                      \
    bison                                \
    gawk                                 \
    texinfo                              \
    python3                              \
    wget                                 \
 && apt-get -q -y autoremove             \
 && rm -rf /var/lib/apt/lists/*

RUN rm /bin/sh && ln -s /bin/bash /bin/sh


# http://www.linuxfromscratch.org/lfs/view/stable/chapter02/hostreqs.html
RUN echo "2.2. Host System Requirements"
RUN echo "Checking Tool Versions"
COPY version-check.sh version-check.sh
RUN ./version-check.sh

# http://www.linuxfromscratch.org/lfs/view/stable/chapter02/creatingpartition.html
RUN echo "2.4. Creating a New Partition Skipped"

# http://www.linuxfromscratch.org/lfs/view/stable/chapter02/creatingpartition.html
RUN echo "2.5. Creating a File System on the Partition Skipped"

# http://www.linuxfromscratch.org/lfs/view/stable/chapter02/aboutlfs.html
RUN echo "2.6. Setting The $LFS Variable"
ENV LFS=/mnt/lfs

# http://www.linuxfromscratch.org/lfs/view/stable/chapter02/mounting.html
RUN echo "2.7. Mounting the New Partition"
RUN echo "Creating LFS directory, no need to mount the partition"
RUN mkdir -pv $LFS

# http://www.linuxfromscratch.org/lfs/view/stable/chapter03/introduction.html
RUN echo "3. Packages and Patches"
RUN echo "Creating sources directory"
RUN mkdir -v $LFS/sources
RUN chmod -v a+wt $LFS/sources
RUN pushd $LFS/sources
RUN echo "Downloading toolchain and verifying integrity"
RUN wget --timestamping http://www.linuxfromscratch.org/lfs/view/stable/wget-list
RUN wget --timestamping --continue --input-file=wget-list
RUN wget --timestamping http://www.linuxfromscratch.org/lfs/downloads/stable/md5sums
RUN md5sum -c md5sums
RUN popd

RUN echo "4. Final Preparations"

# http://www.linuxfromscratch.org/lfs/view/stable/chapter04/creatingminlayout.html
RUN echo "4.2. Creating a limited directory layout in LFS filesystem"
RUN mkdir -pv $LFS/{bin,etc,lib,sbin,usr,var}
RUN case $(uname -m) in x86_64) mkdir -pv $LFS/lib64 ;; esac
RUN mkdir -pv $LFS/tools

# http://www.linuxfromscratch.org/lfs/view/stable/chapter04/addinguser.html
RUN echo "4.3. Adding the LFS User Skipped"


RUN echo "4.4. Setting Up the Environment "
RUN env -i HOME=$HOME TERM=$TERM LFS=$LFS PS1='\u:\w\$ ' /bin/bash
RUN set +h
RUN umask 022
ENV LC_ALL=POSIX
RUN export LFS_TGT=$(uname -m)-lfs-linux-gnu;
ENV PATH=/usr/bin
ENV PATH=/bin:$PATH
ENV PATH=$LFS/tools/bin:$PATH

# http://www.linuxfromscratch.org/lfs/view/stable/chapter04/aboutsbus.html
RUN echo "4.5. About SBUs"
ENV MAKEFLAGS='-j4'


WORKDIR $LFS

# http://www.linuxfromscratch.org/lfs/view/stable/chapter05/binutils-pass1.html
RUN tar -xf  binutils-2.35.tar.xz 
RUN cd binutils-2.35.tar.xz
RUN mkdir -v build
RUN cd build
RUN ../configure --prefix=$LFS/tools       \
             --with-sysroot=$LFS        \
             --target=$LFS_TGT          \
             --disable-nls              \
             --disable-werror
RUN make
RUN make install
RUN cd ../..

# http://www.linuxfromscratch.org/lfs/view/stable/chapter05/gcc-pass1.html
RUN tar -xf gcc-10.2.0.tar.xz
RUN cd gcc-10.2.0
RUN tar -xf ../mpfr-4.1.0.tar.xz
RUN mv -v mpfr-4.1.0 mpfr
RUN tar -xf ../gmp-6.2.0.tar.xz
RUN mv -v gmp-6.2.0 gmp
RUN tar -xf ../mpc-1.1.0.tar.gz
RUN mv -v mpc-1.1.0 mpc
RUN case $(uname -m) in \
  x86_64) \
    sed -e '/m64=/s/lib64/lib/' \
        -i.orig gcc/config/i386/t-linux64 \
 ;; \
esac
RUN mkdir -v build
RUN cd build
RUN ../configure                                       \
    --target=$LFS_TGT                              \
    --prefix=$LFS/tools                            \
    --with-glibc-version=2.11                      \
    --with-sysroot=$LFS                            \
    --with-newlib                                  \
    --without-headers                              \
    --enable-initfini-array                        \
    --disable-nls                                  \
    --disable-shared                               \
    --disable-multilib                             \
    --disable-decimal-float                        \
    --disable-threads                              \
    --disable-libatomic                            \
    --disable-libgomp                              \
    --disable-libquadmath                          \
    --disable-libssp                               \
    --disable-libvtv                               \
    --disable-libstdcxx                            \
    --enable-languages=c,c++
RUN make
RUN make install
RUN cd ../..