const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');

const htmlPlugins = [];
const pages = fs.readdirSync(path.resolve(__dirname, './src/tmpl/pages'));
pages.map(item => {
	const name = item.split('.')[0];
	htmlPlugins.push(
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, `./src/tmpl/pages/${name}.pug`),
			filename: path.resolve(__dirname, `./dist/${name}.html`),
			// inject: false, // не нужно встраивать ссылки на js и css файл
			// chunks: [`${name}`],
			// mViewPort: `width=device-width, initial-scale=1.0`,
			// favicon: `./src/${name}/media/favicon-16x16.png`,
			// title: `${name} Training`,
		})
	)
})

const conf = {
    entry: './src/js/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.js',
        publicPath: ''
    },
    devServer: {
        overlay: true,
        contentBase: './dist',
        stats: 'errors-only'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {
                    pretty: true
                }
            }
        ]
    },
    plugins: [
		new CleanWebpackPlugin({
			verbose: true,
			dry: true,
			protectWebpackAssets: false,
		}),
        new MiniCssExtractPlugin('styles.css'),
		// new HtmlWebpackPlugin({
		// 	template: path.resolve(__dirname, './src/tmpl/pages/index.pug'),
		// 	filename: path.resolve(__dirname, './dist/index.html'),
		// }),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 3000,
			proxy: 'http://localhost:8080/',
			// browse to http://localhost:3000/ during development,
			// ./public directory is being served
			// server: { baseDir: ['dist'] }
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new CopyWebpackPlugin([
            {
				from: 'src/img', 
				to: 'img'
			} 
        ]),
    ].concat(htmlPlugins)
};

module.exports = (env, options) => {
    let production = options.mode === 'production';
    conf.devtool = production
        ? false
        : 'eval-sourcemap';
    return conf;
} 