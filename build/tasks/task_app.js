const fs = require('fs');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./../webpack.common');
const util = require('./../util');

module.exports = (gulp, params) => {

	gulp.task('build:types', done => {
		cd('./src/common_module');
		exec('tsc');
		cd('../../'); // 退回到根目录
		fs.writeFileSync('./node_modules/@types/app/index.d.ts', 'export {};', 'utf8');
		done();
	});

	gulp.task('app:js', done => {
		let opt = webpackMerge(commonConfig, {
			entry: {
				app: './src/bootstrap.ts',
				common: './src/common_module/index.ts'
			},
			output: {
				path: './dist',
				filename: 'js/[name].js',
				library: ['ng2App', '[name]'],
				chunkFilename: '[id].js'
			},
			watch: false
		});
		webpack(opt).watch(200, (err, stats) => {
			util.showWebpackError(err, stats);
			done();
		});
	});

	gulp.task('app', gulp.parallel('app:js'));
};