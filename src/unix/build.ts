import * as fs from "node:fs";
import * as path from "node:path";
import { execFile } from "node:child_process";
import { dowloadZlib } from "../downloadSources";

export async function build_zlib(options: {static: true|false, verbose: true|false, version: string, THREADS: string|number, INSTALL_DIR: string}) {
  let EXTRA_FLAGS="--shared"
	if (options?.static) EXTRA_FLAGS = "--static";
	const zlibFolder = await dowloadZlib({version: options?.version});
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