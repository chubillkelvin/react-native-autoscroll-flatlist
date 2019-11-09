const fs = require("fs");
const fsExtra = require("fs-extra");
const spawn = require("./spawn");

function build() {
    fsExtra.emptyDirSync("./build/dist");
    fs.copyFileSync("./package.json", "./build/dist/package.json", fs.constants.COPYFILE_FICLONE);
    fs.copyFileSync("./README.md", "./build/dist/README.md", fs.constants.COPYFILE_FICLONE);
    return spawn("tsc", ["-p", "./tsconfig.json"]);
}

build();
