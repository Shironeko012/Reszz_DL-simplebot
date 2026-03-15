const os = require("os")
const path = require("path")

const BASE = process.cwd()

const isRailway = !!process.env.RAILWAY_ENVIRONMENT
const isTermux = process.platform === "android"

module.exports = {

PREFIX: ".",

TEMP_DIR: path.join(BASE, "temp"),
LOG_DIR: path.join(BASE, "logs"),
SESSION_DIR: path.join(BASE, "session"),

CPU_CORES: os.cpus().length,

CLEANUP_INTERVAL: 1000 * 60 * 60 * 2, // 2 jam

ENV: {
TERMUX: isTermux,
RAILWAY: isRailway
}

}
