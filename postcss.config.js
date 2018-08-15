const cssnext = require('postcss-cssnext');
const autoprefixer = require('autoprefixer');
const px2rem = require('postcss-px2rem-exclude');
module.exports = {
    plugins: [
        cssnext(),
        autoprefixer({browsers: ['last 2 versions'] }),
        px2rem({
            remUnit: 75, //设计稿尺寸750
            exclude: /node_modules/
        })
    ]
};