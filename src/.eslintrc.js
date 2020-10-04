// @ts-check

/** @type {import("eslint").Linter.Config} */
const config = {
    extends: ["plugin:@pinnacle0/baseline"],
    parserOptions: {
        ecmaVersion: 2017,
    },
    overrides: [
        {
            files: ["./*.tsx", "./component/*.tsx"],
            rules: {
                "@typescript-eslint/no-use-before-define": "off",
                "@typescript-eslint/no-var-requires": "off",
            },
        },
    ],
};

module.exports = config;
