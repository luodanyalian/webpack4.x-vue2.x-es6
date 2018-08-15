'use strict'
const Webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const uglify = require('uglifyjs-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const htmlPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const  PurifyCSSPlugin = require("purifycss-webpack")
const glob = require('glob')
const path = require('path')

module.exports = {
    optimization: {
        splitChunks: {
          cacheGroups: {
            commons: {
              chunks: 'initial',
              minChunks: 2,
              maxInitialRequests: 5, // The default limit is too small to showcase the effect
              minSize: 0, // This is example is too small to create commons chunks
              name: 'common'
            }
          }
        }
    },
    mode: "development",
    entry: {
        main: path.join(__dirname, '../src/index.js'),
    },
    output: {
        filename: 'js/[name].js',
        path: path.join(__dirname, '../dist')
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        },
         //导入的时候不用写拓展名
        extensions: [' ', '.js', '.json', '.vue', '.scss', '.css']
    },
    module: {
        rules: [{
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
                    'css-hot-loader',
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
                    'css-hot-loader',
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
        new Webpack.HotModuleReplacementPlugin(), //调用webpack的热更新插件
        new CleanWebpackPlugin(['dist']), //传入数组,指定要删除的目录
        new VueLoaderPlugin(),
        new uglify(),
        new htmlPlugin({
            minify: { //是对html文件进行压缩
                removeAttributeQuotes: true //removeAttrubuteQuotes是却掉属性的双引号。
            },
            title: 'webpack4.x+vue2.x+es6',
            hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template: './src/index.html' //是要打包的html模版路径和文件名称。
        }),
        new MiniCssExtractPlugin({
          filename: 'css/[name].css'
        }),
        // new PurifyCSSPlugin({
        //     //消除冗余代码
        //     // 首先保证找路径不是异步的,所以这里用同步的方法
        //     // path.join()也是path里面的方法,主要用来合并路径的
        //     // 'src/*.html' 表示扫描每个html的css
        //     paths: glob.sync(path.join(__dirname, '../src/*.html')),
        // })
    ],
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300, //防止重复保存频繁重新编译,300ms内重复保存不打包
        poll: 1000 //每秒询问的文件变更的次数
    },
    devServer: {
        // 设置服务器访问的基本目录
        contentBase: path.join(__dirname, '../dist'), //最好设置成绝对路径
        inline: true,
        compress: true,
        host: 'localhost',
        port: 8090,
        open: true, // 设置自动拉起浏览器
        hot: true, // 设置热更新
        historyApiFallback: true
    }
}