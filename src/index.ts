#!/usr/bin/env node
import * as path from "node:path";
import yargs from "yargs";

const defaultVersions = {
  PHP_VERSION: "8.0.19",
  ZLIB_VERSION: "1.2.11",
  GMP_VERSION: "6.2.1",
  CURL_VERSION: "curl-7_83_1",
  YAML_VERSION: "0.2.5",
  LEVELDB_VERSION: "1c7564468b41610da4f498430e795ca4de0931ff",
  LIBXML_VERSION: "2.9.14",
  LIBPNG_VERSION: "1.6.37",
  LIBJPEG_VERSION: "9e",
  OPENSSL_VERSION: "1.1.1o",
  LIBZIP_VERSION: "1.8.0",
  SQLITE3_YEAR: "2022",
  SQLITE3_VERSION: "3380500",
  LIBDEFLATE_VERSION: "b01537448e8eaf0803e38bdba5acef1d1c8effba",
  EXT_PTHREADS_VERSION: "4.0.0",
  EXT_YAML_VERSION: "2.2.2",
  EXT_LEVELDB_VERSION: "317fdcd8415e1566fc2835ce2bdb8e19b890f9f3",
  EXT_CHUNKUTILS2_VERSION: "0.3.3",
  EXT_XDEBUG_VERSION: "3.1.4",
  EXT_IGBINARY_VERSION: "3.2.7",
  EXT_CRYPTO_VERSION: "0.3.2",
  EXT_RECURSIONGUARD_VERSION: "0.1.0",
  EXT_LIBDEFLATE_VERSION: "0.1.0",
  EXT_MORTON_VERSION: "0.1.2",
  EXT_XXHASH_VERSION: "0.1.1"
}

// Set options
// Darwin (macOS)
if (process.platform === "darwin") {
  if (!process.env.LIBTOOLIZE) process.env.LIBTOOLIZE = "glibtoolize"
}

// Unix
if (!process.env.LIBTOOL) process.env.LIBTOOL = "glibtool"
if (!process.env.LIBTOOLIZE) process.env.LIBTOOLIZE = "libtoolize"
if (!process.env.CC) process.env.CC = "gcc";
if (!process.env.CXX) process.env.CXX = "g++";
if (!process.env.RANLIB) process.env.RANLIB = "ranlib"

// gcc envs
if (!process.env.CFLAGS) process.env.CFLAGS = ""
if (!process.env.CXXFLAGS) process.env.CXXFLAGS = ""

const Yargs = yargs(process.argv.slice(2)).help().version(false).alias("h", "help").wrap(yargs.terminalWidth())
// To Show help .command({command: "*", handler: () => {Yargs.showHelp();}})
.option("verbose", {
  alias: "V",
  describe: "Verbose output",
  type: "boolean",
  default: false
}).option("install_path", {
  describe: "Install path",
  type: "string",
  default: path.join(process.cwd(), "bin/")
}).option("targer", {
  alias: "t",
  describe: "Build target",
  type: "string",
  default: process.platform,
  choices: [
    // Classic systems
    "darwin", "darwin-arm64", "darwin-x64", "macos", "macos-arm64", "macos-x64", // MacOS System
    "linux", "linux-arm64", "linux-x64", /*"linux-armv7l", "linux-armv6l", "linux-armv8l", "linux-mips", "linux-mips64", "linux-mips64le", "linux-mipsle", "linux-ppc64le", "linux-s390x",*/ "linux-x64", // Linux System
    "android", "android-arm64", // Android System only ARM64/aarch64
    // TODO: Add Windows
    // "windows", "windows-x64", "windows-x86", "win32", "win64", "win32-x64", "win32-x86", // Windows System
  ]
}).option("threads", {
  alias: "j",
  describe: "Number of threads",
  type: "number",
  default: 1
}).option("debug", {
  alias: "d",
  describe: "Will compile xdebug, will not remove sources",
  type: "boolean",
  default: false
}).option("static", {
  alias: "s",
  describe: "Will compile everything statically",
  type: "boolean",
  default: false
}).option("optimize", {
  alias: "f",
  describe: "Enable abusive optimizations",
  type: "boolean",
  default: false
}).option("g2", {
  alias: "g",
  describe: "Enable G2",
  type: "boolean",
  default: false
}).option("valgrind", {
  alias: "v",
  describe: "enable valgrind support in PHP",
  type: "boolean",
  default: false
}).option("pass", {
  alias: "a",
  describe: `Will pass -fsanitize=${process.env.OPTARG} to compilers and linkers`,
  type: "string",
  default: ""
});

// Parse arguments
const options = Yargs.parseSync();
// process.env.CXX = `${process.env.TOOLCHAIN_PREFIX}-g++`
// process.env.AR = `${process.env.TOOLCHAIN_PREFIX}-ar`
// process.env.RANLIB = `${process.env.TOOLCHAIN_PREFIX}-ranlib`
// process.env.CPP = `${process.env.TOOLCHAIN_PREFIX}-cpp`
// process.env.LD = `${process.env.TOOLCHAIN_PREFIX}-ld`
if (!process.env.THREADS) process.env.THREADS = "1";
if (!process.env.march) process.env.march = "native";
if (!process.env.mtune) process.env.mtune = "native";
if (!process.env.CFLAGS) process.env.CFLAGS = "";

process.env.PKG_CONFIG_ALLOW_SYSTEM_LIBS="yes"
process.env.PKG_CONFIG_ALLOW_SYSTEM_CFLAGS="yes"
process.env.CFLAGS=`-O2 -fPIC ${process.env.CFLAGS}`
process.env.CXXFLAGS=`${process.env.CFLAGS} ${process.env.CXXFLAGS}`
process.env.LIBRARY_PATH=`${options.install_path}/lib:$LIBRARY_PATH`
process.env.PKG_CONFIG_PATH=`${options.install_path}/lib/pkgconfig`

console.log({...options, ...process.env});