import { execFile } from "node:child_process";

export default function type(command: string): Promise<boolean> {
  return new Promise(resolve => {
    execFile("type", [command], (err) => {
      if (err) {
        return execFile("command", ["-v", command], (err) => {
          if (err) return resolve(false);
          return resolve(true);
        })
      }
      return resolve(true);
    })
  });
}