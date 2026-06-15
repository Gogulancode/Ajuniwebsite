const { spawn } = require("child_process");
const path = require("path");

const pgCtl = path.join("C:", "Program Files", "PostgreSQL", "17", "bin", "pg_ctl.exe");
const pgData = path.join(__dirname, "..", "pgdata");
const logFile = path.join(pgData, "logfile");

const proc = spawn(pgCtl, ["-D", pgData, "-l", logFile, "start"], {
  stdio: "ignore",
  detached: true,
});

proc.unref();

console.log("Starting local PostgreSQL on port 15433...");
setTimeout(() => process.exit(0), 2000);
