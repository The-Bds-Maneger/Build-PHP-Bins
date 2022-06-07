import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import tar from "tar";
import { getBuffer as fetchBuffer } from "./lib/download";

export async function downloadPHPSource(options: {version: string}) {
  const tempFile = path.join(os.tmpdir(), `php-${options.version}.tar.gz`);
  process.stdout.write("Downloading PHP source...");
  await fs.promises.writeFile(tempFile, await fetchBuffer(`https://github.com/php/php-src/archive/php-${options?.version}.tar.gz`));
  await fs.promises.mkdir(path.join(process.cwd(), "php"), {recursive: true});
  await tar.extract({file: tempFile, cwd: path.join(process.cwd(), "php")});
  await fs.promises.rm(tempFile);
  console.log(" OK!");
  return path.join(process.cwd(), "php");
}

export async function dowloadZlib(options: {version: string}) {
  const tempFile = path.join(os.tmpdir(), `zlib-${options.version}.tar.gz`);
  process.stdout.write("Downloading zlib...");
  await fs.promises.writeFile(tempFile, await fetchBuffer(`https://github.com/madler/zlib/archive/v${options?.version}.tar.gz`));
  await fs.promises.mkdir(path.join(process.cwd(), "zlib"), {recursive: true});
  await tar.extract({file: tempFile, cwd: path.join(process.cwd(), "zlib")});
  await fs.promises.rm(tempFile);
  console.log(" OK!");
  return path.join(process.cwd(), "zlib");
}