import fs from "fs";
import fsExtra from "fs-extra";
import packageJSON from "../package.json";
import {Utility} from "./Utility";

function build() {
    fsExtra.emptyDirSync("../build/dist");
    fs.copyFileSync("../README.md", "../build/dist/README.md", fs.constants.COPYFILE_FICLONE);
    Utility.runProcess("tsc", ["-p", "./tsconfig.json"]);
    packageJSON.main = "index.js";
    fs.writeFileSync("../build/dist/package.json", JSON.stringify(packageJSON));
    Utility.prettier("../build/dist/package.json");
}

build();
