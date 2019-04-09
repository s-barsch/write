const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: "./src/index.tsx",
    mode:  "development",
    watch: true,
    output: {
        filename: "bundle.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                use: { loader: 'awesome-typescript-loader' }
            }
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
    },
    devtool: "source-map"
};
