var path = require('path');

console.log(path);
console.log(__dirname);
console.log(path.join(__dirname, '.'));

module.exports = {
    entry: './src/main/js/app_react.js',
    devtool: 'sourcemaps',
    cache: true,
    output: {
        path: __dirname + "/src/main/resources/static/built",
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                // include: [/(node_modules)/,path.resolve(__dirname, 'BirthdayGuy'),],
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    }
};