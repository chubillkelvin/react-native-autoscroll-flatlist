import childProcess from "child_process";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";

export class Utility {
    /**
     * Run a command (support both global binary & node_modules binary) and wait for its execution.
     *
     * Throw Error if any error occurs, or returning non-zero result.
     *
     * Usage:
     *      runProcess("prettier", ["--config", "/path"])
     */
    static runProcess(command: string, args: string[]) {
        console.info(chalk.white("Running: ") + chalk.yellowBright(command + " " + args.join(" ")));

        const localPath = path.resolve(__dirname, "../../node_modules/.bin/" + command);
        const canonicalCommand = fs.existsSync(localPath) ? localPath : command;
        const result = childProcess.spawnSync(canonicalCommand, args, {
            stdio: "inherit",
            shell: process.platform === "win32",
        });
        if (result.error) {
            throw new Error("Process execution error: " + result.error);
        }
        if (result.status !== 0) {
            if (command === "prettier" && result.status === 2) {
                console.info("No matched file for Prettier, but not an error. Program continuing ...");
            } else {
                throw new Error(`Process returns non-zero exit code (${result.status})`);
            }
        }
    }

    /**
     * Output to console in a clear way, with color (supported by chalk library).
     *
     * Usage:
     *      print("Start downloading")
     *      print("Downloading resources from HTTP", "http://abc.com/end/point")
     */
    static print(descriptiveTitle: string, extraInfo: string = "") {
        console.info("");
        console.info(chalk.black.bgWhiteBright.bold(" " + descriptiveTitle + " ") + (extraInfo ? chalk.black.bgWhite(" " + extraInfo + " ") : ""));
    }

    /**
     * Print the detailed error information, then exit the current process, with code 1.
     */
    static printErrorThenExit(...error: (Error | string)[]) {
        console.info("");
        console.info(chalk.white.bgRed(` ❌ ${error} `));
        console.info(error);
        process.exit(1);
    }

    /**
     * Execute "prettier" command to prettify the code。
     *
     * If checkOnly is truthy, it will check the source format, and triggers error if bad formatted.
     * Else, it will go through and modify the source (if needed) in correct format.
     */
    static prettier(source: string, checkOnly: boolean = false) {
        const configPath = path.resolve(__dirname, "../prettier.config.js");
        Utility.runProcess("prettier", ["--config", configPath, checkOnly ? "--list-different" : "--write", source]);
    }

    /**
     * Formatting target files via Prettier
     *
     * Accept both file path or folder as input
     *
     * Example:
     * ```
     * formatFile('./src')
     * formatFile('./src/index.ts', './api')
     * ```
     */
    static formatFile(...files: string[]) {
        files
            .filter(file => path.extname(file) || (!path.extname(file) && fs.readdirSync(file).length))
            .map(file => (path.extname(file) ? file : file + "/*"))
            .forEach(file => {
                Utility.print(`Formatting File: ${file}`);
                Utility.prettier(file);
            });
    }
}
