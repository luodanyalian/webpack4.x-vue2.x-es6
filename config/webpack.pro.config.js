'use strict'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const uglify = require('uglifyjs-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const htmlPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const  PurifyCSSPlugin = require("purifycss-webpack")
const glob = require('glob')
const path = require('path')

module.exports = {
	mode: "production",
	entry: {
		main: path.join(__dirname, '../src/index.js'),
	},
	output: {
	  filename: 'bundle.js',
	  path: path.join(__dirname, '../dist')
	},
	resolve: { //导入的时候不用写拓展名
		extensions: [' ', '.js', '.json', '.vue', '.scss', '.css']
	},
	module: {
		rules:  [{
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                	{
			            loader: MiniCssExtractPlugin.loader,
			            options: {
			              //背景图路径
			              publicPath: '../'
			            }
			         },
                	'css-loader?importLoaders=1',
            		'postcss-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                	{
			            loader: MiniCssExtractPlugin.loader,
			            options: {
			              //背景图路径
			              publicPath: '../'
			            }
			         },
		            'css-loader?importLoaders=1',
		            'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 50000, //表示小于50kb的图片转为base64,大于50kb的是路径
                        outputPath: 'images' //定义输出的图片文件夹
                    }
                }]
            }
        ]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']), //传入数组,指定要删除的目录
		new MiniCssExtractPlugin({
	      filename: 'style.css'//压缩冗余代码
	    }),
	    // new PurifyCSSPlugin({
	    // 	//消除冗余代码
	    //     // 首先保证找路径不是异步的,所以这里用同步的方法
	    //     // path.join()也是path里面的方法,主要用来合并路径的
	    //     // 'src/*.html' 表示扫描每个html的css
	    //     paths: glob.sync(path.join(__dirname, '../src/*.html')),
	    // }),
        new VueLoaderPlugin(),
        new uglify(),
        new htmlPlugin({
            minify: { //是对html文件进行压缩
                removeAttributeQuotes: true //removeAttrubuteQuotes是却掉属性的双引号。
            },
            title: 'webpack4.x+vue2.x+es6',
            hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template: './src/index.html' //是要打包的html模版路径和文件名称。
        })
	]
}