const child_process = require("child_process");
const path = require("path");
const os = require("os");

module.exports = {
  target: /android|Android/gi,
  arch: /aarch64|arm64/gi,
  zipOut: "android_aarch64",
  preInstall: ()=>child_process.execFileSync("sudo", ["bash", path.resolve(__dirname, "../PreInstall/musl-cross.sh")], {stdio: "inherit"}),
  build: async()=>child_process.execFileSync(path.resolve(__dirname, "../php_build/compile.sh"), ["-t", "android-aarch64", "-x", "-f", "-g", `-j${os.cpus().length}`], {
    cwd: path.resolve(__dirname, "../php_build"),
    stdio: "inherit"
  }),
};