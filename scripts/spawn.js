const childProcess = require("child_process");

module.exports = function(cmd, args) {
    const isWindows = process.platform === "win32";
    return childProcess.spawnSync(isWindows ? cmd + ".cmd" : cmd, args);
};
