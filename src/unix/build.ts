import * as fs from "node:fs";
import * as path from "node:path";
import { exec, execFile } from "node:child_process";
import * as DownloadSource from "../downloadSources";

export async function build_zlib(options: {static: true|false, verbose: true|false, version: string, THREADS: string|number, INSTALL_DIR: string}) {
  let EXTRA_FLAGS="--shared"
	if (options?.static) EXTRA_FLAGS = "--static";
	const zlibFolder = await DownloadSource.downloadZlib({version: options?.version});
	process.stdout.write("[Zlib] checking...");
	await new Promise((resolve, reject) => {
    execFile("./configure", [`--prefix=${options?.INSTALL_DIR}`, EXTRA_FLAGS], {cwd: zlibFolder}, (err) => {
      if (err) return reject(err);
      process.stdout.write(" compiling...");
      execFile("make", ["-j", String(options?.THREADS)], {cwd: zlibFolder}, (err) => {
        if (err) return reject(err);
        process.stdout.write(" installing...");
        execFile("make", ["install"], {cwd: zlibFolder}, err => {
          if (err) return reject(err);
          return resolve("");
        })
      });
    });
  });
  if (options?.static) await fs.promises.rm(path.join(options?.INSTALL_DIR, "lib/libz.a"));
  process.stdout.write(" done!\n");
}

export async function build_gmp(options: {crossCopiler: true|false, install_dir: string, CONFIGURE_FLAGS: string, GMP_VERSION: string, THREADS: number}) {
	process.env.jm_cv_func_working_malloc = "yes"
	process.env.ac_cv_func_malloc_0_nonnull = "yes"
	process.env.jm_cv_func_working_realloc = "yes"
	process.env.ac_cv_func_realloc_0_nonnull = "yes"

  let EXTRA_FLAGS = "--disable-assembly";
	if (options?.crossCopiler) EXTRA_FLAGS=""

	const gmpPath = await DownloadSource.downloadGmp({version: options?.GMP_VERSION});
	await new Promise((resolve, reject) => {
    execFile("./configure", [`--prefix=${options.install_dir}`, "--disable-posix-threads", "--enable-static", "--disable-shared", EXTRA_FLAGS, options?.CONFIGURE_FLAGS], {cwd: gmpPath, env: {...process.env, ABI: process.env.GMP_ABI}}, err => {
      if (err) return reject(err);
      process.stdout.write(" compiling...");
      execFile("make", ["-j", String(options?.THREADS)], {cwd: gmpPath, env: {...process.env, ABI: process.env.GMP_ABI}}, (err) => {
        if (err) return reject(err);
        process.stdout.write(" installing...");
        execFile("make", ["install"], {cwd: gmpPath, env: {...process.env, ABI: process.env.GMP_ABI}}, err => {
          if (err) return reject(err);
          return resolve("");
        })
      });
    });
  });
  process.stdout.write(" done!\n");
}

export async function build_openssl(options: {static: true|false, VERSION: string, installDir: string, THREADS: number, OPENSSL_TARGET: string}) {
	const OPENSSL_CMD = [`--prefix=${options?.installDir}`, `--openssldir=${options?.installDir}`, "no-asm", "no-hw", "no-engine"]
	if (options?.OPENSSL_TARGET) OPENSSL_CMD.push(`--target=${options?.OPENSSL_TARGET}`);
	if (options?.static) OPENSSL_CMD.push("no-shared"); else OPENSSL_CMD.push("shared")

	// WITH_OPENSSL="--with-openssl=$INSTALL_DIR"
	const opensslPath = await DownloadSource.downloadOpenssl({version: options?.VERSION});
  await new Promise((resolve, reject) => {
    execFile("./configure", OPENSSL_CMD, {cwd: opensslPath}, (err) => {
      if (err) return reject(err);
      process.stdout.write(" compiling...");
      execFile("make", ["-j", String(options?.THREADS)], {cwd: opensslPath}, (err) => {
        if (err) return reject(err);
        process.stdout.write(" installing...");
        execFile("make", ["install_sw"], {cwd: opensslPath}, err => {
          if (err) return reject(err);
          return resolve("");
        })
      });
    });
  });
  process.stdout.write(" done!\n");
}

export async function buildCurl(options: {version: string, installDir: string, THREADS: number, static: true|false}) {
  const configureOptions = ["--disable-dependency-tracking", "--enable-ipv6", "--enable-optimize", "--enable-http", "--enable-ftp", "--disable-dict", "--enable-file",
  "--without-librtmp", "--disable-gopher", "--disable-imap", "--disable-pop3", "--disable-rtsp", "--disable-smtp", "--disable-telnet", "--disable-tftp", "--disable-ldap",
  "--disable-ldaps", "--without-libidn", "--without-libidn2", "--without-brotli", "--without-nghttp2", "--without-zstd",
  `--with-zlib=${options?.installDir}`, `--with-ssl=${options?.installDir}`, "--enable-threaded-resolver", `--prefix=${options?.installDir}`
  ];
  if (options?.static) configureOptions.push("--enable-static", "--disable-shared"); else configureOptions.push("--disable-static", "--enable-shared");
  const curlPath = await DownloadSource.downloadCurl({version: options?.version});
  await new Promise((resolve, reject) => {
    execFile("./buildconf", ["--force"], {cwd: curlPath}, (err) => {
      if (err) return reject(err);
      process.stdout.write(" compiling...");
      execFile("./configure", configureOptions, {cwd: curlPath}, (err) => {
        if (err) return reject(err);
        process.stdout.write(" installing...");
        execFile("make", ["-j", String(options?.THREADS)], {cwd: curlPath}, (err) => {
          if (err) return reject(err);
          execFile("make", ["install"], {cwd: curlPath}, err => {
            if (err) return reject(err);
            return resolve("");
          })
        });
      });
    });
  });
  process.stdout.write(" done!\n");
}

export async function buildYaml(options: {installDir: string, THREADS: number, static: true|false, version: string}) {
  const configureOPtions = [`--prefix=${options?.installDir}`]
  if (options?.static) configureOPtions.push("--enable-static", "--disable-shared"); else configureOPtions.push("--disable-static", "--enable-shared");
  const yamlPath = await DownloadSource.downloadYaml({version: options?.version});
  await new Promise((resolve, reject) => {
    exec("./bootstrap", {cwd: yamlPath}, (err) => {
      if (err) return reject(err);
      execFile("./configure", configureOPtions, {cwd: yamlPath}, async (err) => {
        if (err) return reject(err);
        // sed -i=".backup" 's/ tests win32/ win32/g' Makefile
        await fs.promises.writeFile(path.join(yamlPath, "Makefile"), (await fs.promises.readFile(path.join(yamlPath, "Makefile"), "utf8")).replace(/ tests win32/g, " win32"));
        process.stdout.write(" compiling...");
        execFile("make", ["-j", String(options?.THREADS), "all"], {cwd: yamlPath}, (err) => {
          if (err) return reject(err);
          process.stdout.write(" installing...");
          execFile("make", ["install"], {cwd: yamlPath}, err => {
            if (err) return reject(err);
            return resolve("");
          })
        });
      });
    });
  });
  process.stdout.write(" done!\n");
}

export async function buildLeveldb(options: {installDir: string, THREADS: number, static: true|false, version: string, extraCmake: Array<string>}) {
  const configureOptions = [
    `-DCMAKE_INSTALL_PREFIX=${options?.installDir}`,
    `-DCMAKE_PREFIX_PATH=${options?.installDir}`,
    "-DCMAKE_INSTALL_LIBDIR=lib",
    "-DLEVELDB_BUILD_TESTS=OFF",
    "-DLEVELDB_BUILD_BENCHMARKS=OFF",
    "-DLEVELDB_SNAPPY=OFF",
    "-DLEVELDB_ZSTD=OFF",
    "-DLEVELDB_TCMALLOC=OFF",
    "-DCMAKE_BUILD_TYPE=Release",
    ...options?.extraCmake
  ];
  const leveldbPath = await DownloadSource.downloadLeveldb({version: options?.version});
  await new Promise((resolve, reject) => {
    execFile("./configure", configureOptions, {cwd: leveldbPath}, (err) => {
      if (err) return reject(err);
      process.stdout.write(" compiling...");
      execFile("make", ["-j", String(options?.THREADS)], {cwd: leveldbPath}, (err) => {
        if (err) return reject(err);
        process.stdout.write(" installing...");
        execFile("make", ["install"], {cwd: leveldbPath}, err => {
          if (err) return reject(err);
          return resolve("");
        })
      });
    });
  });
  process.stdout.write(" done!\n");
}