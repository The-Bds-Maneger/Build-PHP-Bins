FROM ubuntu:latest
ENV DEBIAN_FRONTEND="noninteractive"
RUN apt update && \
    apt -y install build-essential curl make autoconf automake libtool m4 wget gzip bzip2 bison g++ git cmake pkg-config re2c

# Compile and install musl
WORKDIR /build
RUN git clone https://github.com/pmmp/musl-cross-make.git musl
WORKDIR /build/musl
RUN (echo "TARGET = aarch64-linux-musl"; echo "OUTPUT = /usr/local") > config.mak
RUN make && make install -j$(nproc)
