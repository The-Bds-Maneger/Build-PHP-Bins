const child_process = require("child_process");
const path = require("path");
const os = require("os");

module.exports = {
  target: /MacOS|Mac|mac|macos/gi,
  arch: /x64/gi,
  build: Mac_Intel,
  zipOut: "darwin_x64"
};

// Mac Intel
async function Mac_Intel() {
  process.env.PATH = "/usr/local/opt/bison/bin:" + process.env.PATH
  process.env.LDFLAGS = "-L/usr/local/opt/bison/lib"
  return child_process.execFileSync(path.resolve(__dirname, "../php_build/compile.sh"), ["-t", "mac-x86-64", `-j${os.cpus().length}`, "-f", "-g"], {
    cwd: path.resolve(__dirname, "../php_build"),
    stdio: "inherit"
  });
}