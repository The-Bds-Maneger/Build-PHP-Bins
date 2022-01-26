const child_process = require("child_process");
const path = require("path");
module.exports = {
  build: async () => child_process.execSync("windows-compile-vs.bat", {cwd: path.resolve(__dirname, "../php_build"), stdio: "inherit"}),
  target: /win32|windows|Windows|Win32/gi,
  arch: /x64/gi,
  zipOut: "win32_x64"
};