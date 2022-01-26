const child_process = require("child_process");
const path = require("path");
const os = require("os");

module.exports = {
  build: Mac_aarch64,
  target: /MacOS|Mac|mac|macos/gi,
  arch: /aarch64|arm64/gi,
  zipOut: "darwin_arm64"
};

// Mac ARMs
function Mac_aarch64() {
  // MacOS Set Paths
  process.env.PATH = "/usr/local/opt/bison/bin:" + process.env.PATH
  process.env.LDFLAGS = "-L /usr/local/opt/bison/lib"
  // Build php
  return child_process.execFileSync(path.resolve(__dirname, "../php_build/compile.sh"), ["-t", "mac-arm64", `-j${os.cpus().length}`, "-f", "-g"], {
    cwd: path.resolve(__dirname, "../php_build"),
    stdio: "inherit"
  });
}
