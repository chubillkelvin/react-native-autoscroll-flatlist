const spawn = require("./spawn");

function format() {
    return spawn("prettier", ["--config", "./prettier.json", "--write", "./{src,scripts}/*.{js,ts,tsx}"]);
}

function lint() {
    return spawn("tslint", ["./src/*.{ts, tsx}"]);
}

function prettier() {
    return spawn("prettier", ["--config", "./prettier.json", "--list-different", "./{src,scripts}/*.{js,ts,tsx}"]);
}

function compile() {
    return spawn("tsc", ["-p", "scripts/tsconfig.json"]);
}

format();
lint();
prettier();
compile();
