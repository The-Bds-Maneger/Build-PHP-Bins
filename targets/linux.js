const child_process = require("child_process");
const path = require("path");
const os = require("os");

module.exports = {
  build: Linux,
  target: /linux|Linux/gi,
  arch: /x64|arm64|aarch64/gi,
  zipOut: "linux_"+process.arch
};

//Set Build Function
async function Linux() {
  let BuildScript = path.resolve(__dirname, "../php_build/compile.sh");
  child_process.execFileSync(BuildScript, [`-j${os.cpus().length}`], {
    cwd: path.resolve(__dirname, "../php_build"),
    stdio: "inherit"
  });
}