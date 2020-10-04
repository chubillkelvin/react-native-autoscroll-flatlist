const fs = require("fs");
const fsExtra = require("fs-extra");
const spawn = require("./spawn");
const package = require("../package.json");

function build() {
    fsExtra.emptyDirSync("../build/dist");
    package["main"] = "index.js";
    fs.writeFileSync("../build/dist/package.json", JSON.stringify(package));
    spawn("prettier", ["--config", "./prettier.json", "--write", "../build/dist/package.json"]);
    fs.copyFileSync("../README.md", "../build/dist/README.md", fs.constants.COPYFILE_FICLONE);
    return spawn("tsc", ["-p", "./tsconfig.json"]);
}

build();
