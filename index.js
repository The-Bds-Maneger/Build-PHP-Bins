const fs = require("fs");
const path = require("path");
const Yargs = require("yargs");
const adm_zip = require("adm-zip");

/**
* @type {"aix"|"darwin"|"freebsd"|"linux"|"android"|"openbsd"|"sunos"|"win32"}
 */
const CurrentPlatform = process.platform;

/**
 * @type {"arm"|"arm64"|"aarch64"|"ia32"|"mips"|"mipsel"|"ppc"|"ppc64"|"s390"|"s390x"|"x32"|"x64"}
 */
const CurrentArch = process.arch;

/**
 * @type {Array<{
 *   target: RegExp;
 *   arch: RegExp | string;
 *   preInstall: undefined|Function;
 *   build: () => Promise<string>,
 *   zipOut: string|undefined;
 * }>}
 */
const Targets = fs.readdirSync(path.resolve(__dirname,"./targets/")).map(a => require(path.resolve(__dirname, "./targets/", a)));


Yargs.option("target", {
  alias: "t",
  description: "Select Target to Build",
  default: CurrentPlatform
});
Yargs.option("arch", {
  alias: "a",
  description: "Select Arch to build",
  default: CurrentArch,
});
Yargs.option("pre_install", {
  type: "boolean",
  description: "Run Pre Install",
  default: false,
});
async function CreateZip(Folder = "./bin", MoreToFileName = "") {
  const Zip = new adm_zip();
  Zip.addLocalFolder(path.resolve(Folder));
  return fs.writeFileSync(path.resolve(__dirname, MoreToFileName+"_bin.zip"), Zip.toBuffer());
}
(async() => {
  console.log("Host info, Arch:", CurrentArch, "System:", CurrentPlatform);
  const Opt = Yargs.help().version(false).parse();
  const Platform = (Opt.target||Opt.t)||CurrentPlatform;
  const arch = (Opt.arch||Opt.a)||CurrentArch;
  const Runners = Targets.filter(Target => Target.arch.test(arch) && Target.target.test(Platform));
  if (Runners.length === 0) {
    console.error("No Target or Arch Avaible");
    return process.exit(1);
  }
  if (Opt["pre_install"]) {
    for (let { preInstall } of Runners) {
      if (typeof preInstall === "function") await preInstall();
    }
    return;
  }
  for (const { build, zipOut } of Runners) {
    console.log("Build PHP Binarys to System:", Platform, "and Arch:", arch);
    console.log("Cleaning Build Folder!");
    const BinPath = path.resolve(__dirname, "./php_build/bin");
    const InstallData = path.resolve(__dirname, "./php_build/install_data");
    if (fs.existsSync(BinPath)) fs.rmSync(BinPath, {recursive: true});
    if (fs.existsSync(InstallData)) fs.rmSync(InstallData, {recursive: true});
    await build();
    console.log("Creating Zip File!")
    CreateZip(BinPath, zipOut);
  }
})().catch(err => {
  console.error("Main Process crash!");
  console.error(err);
  return process.exit(2);
});
