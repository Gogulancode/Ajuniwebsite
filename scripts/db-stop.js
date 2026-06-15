const { spawn } = require("child_process");
const path = require("path");

const pgCtl = path.join("C:", "Program Files", "PostgreSQL", "17", "bin", "pg_ctl.exe");
const pgData = path.join(__dirname, "..", "pgdata");

const proc = spawn(pgCtl, ["-D", pgData, "stop"], {
  stdio: "inherit",
});

proc.on("exit", (code) => process.exit(code ?? 0));
