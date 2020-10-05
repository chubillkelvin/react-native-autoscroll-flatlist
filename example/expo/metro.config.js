const path = require("path");

module.exports = {
    projectRoot: path.resolve(__dirname),
    watchFolders: [path.resolve(__dirname, "./node_modules"), path.resolve(__dirname, "../../src/node_modules"), path.resolve(__dirname, "../../src")],
    resolver: {
        extraNodeModules: new Proxy(
            {},
            {
                get: (target, name) => {
                    if (name === "react-native-autoscroll-flatlist") {
                        return path.join(__dirname, "../../src/");
                    } else if (name === "react") {
                        return path.join(__dirname, "./node_modules/react");
                    } else if (name === "react-native") {
                        return path.join(__dirname, "./node_modules/react-native");
                    }
                },
            }
        ),
    },
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
};
