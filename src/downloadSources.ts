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

export async function downloadZlib(options: {version: string}) {
  const tempFile = path.join(os.tmpdir(), `zlib-${options.version}.tar.gz`);
  process.stdout.write("Downloading zlib...");
  await fs.promises.writeFile(tempFile, await fetchBuffer(`https://github.com/madler/zlib/archive/v${options?.version}.tar.gz`));
  await fs.promises.mkdir(path.join(process.cwd(), "zlib"), {recursive: true});
  await tar.extract({file: tempFile, cwd: path.join(process.cwd(), "zlib")});
  await fs.promises.rm(tempFile);
  console.log(" OK!");
  return path.join(process.cwd(), "zlib");
}

export async function downloadGmp(options: {version: string}) {
  const tempFile = path.join(os.tmpdir(), `gmp-${options.version}.tar.gz`);
  process.stdout.write("Downloading gmp...");
  await fs.promises.writeFile(tempFile, await fetchBuffer(`https://gmplib.org/download/gmp/gmp-${options?.version}.tar.bz2`));
  await fs.promises.mkdir(path.join(process.cwd(), "gmp"), {recursive: true});
  await tar.extract({file: tempFile, cwd: path.join(process.cwd(), "gmp")});
  await fs.promises.rm(tempFile);
  console.log(" OK!");
  return path.join(process.cwd(), "gmp");
}

export async function downloadOpenssl(options: {version: string}) {
  const tempFile = path.join(os.tmpdir(), `openssl-${options.version}.tar.gz`);
  process.stdout.write("Downloading openssl...");
  await fs.promises.writeFile(tempFile, await fetchBuffer(`http://www.openssl.org/source/openssl-${options?.version}.tar.gz`));
  await fs.promises.mkdir(path.join(process.cwd(), "openssl"), {recursive: true});
  await tar.extract({file: tempFile, cwd: path.join(process.cwd(), "openssl")});
  await fs.promises.rm(tempFile);
  console.log(" OK!");
  return path.join(process.cwd(), "openssl");
}

export async function downloadCurl(options: {version: string}) {
  const tempFile = path.join(os.tmpdir(), `curl-${options.version}.tar.gz`);
  process.stdout.write("Downloading curl...");
  await fs.promises.writeFile(tempFile, await fetchBuffer(`https://github.com/curl/curl/archive/${options?.version}.tar.gz`));
  await fs.promises.mkdir(path.join(process.cwd(), "curl"), {recursive: true});
  await tar.extract({file: tempFile, cwd: path.join(process.cwd(), "curl")});
  await fs.promises.rm(tempFile);
  console.log(" OK!");
  return path.join(process.cwd(), "curl");
}

export async function downloadYaml(options: {version: string}) {
  const tempFile = path.join(os.tmpdir(), `yaml-${options.version}.tar.gz`);
  process.stdout.write("Downloading yaml...");
  await fs.promises.writeFile(tempFile, await fetchBuffer(`https://github.com/yaml/libyaml/archive/${options?.version}.tar.gz`));
  await fs.promises.mkdir(path.join(process.cwd(), "yaml"), {recursive: true});
  await tar.extract({file: tempFile, cwd: path.join(process.cwd(), "yaml")});
  await fs.promises.rm(tempFile);
  console.log(" OK!");
  return path.join(process.cwd(), "yaml");
}

export async function downloadLeveldb(options: {version: string}) {
  const tempFile = path.join(os.tmpdir(), `leveldb-${options.version}.tar.gz`);
  process.stdout.write("Downloading yaml...");
  await fs.promises.writeFile(tempFile, await fetchBuffer(`https://github.com/pmmp/leveldb/archive/${options?.version}.tar.gz`));
  await fs.promises.mkdir(path.join(process.cwd(), "leveldb"), {recursive: true});
  await tar.extract({file: tempFile, cwd: path.join(process.cwd(), "leveldb")});
  await fs.promises.rm(tempFile);
  console.log(" OK!");
  return path.join(process.cwd(), "leveldb");
}