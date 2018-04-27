import babel from 'rollup-plugin-babel'

const license = `/*!
 * resouce-cache
 * https://github.com/yomotsu/resouce-cache
 * (c) 2018 @yomotsu
 * Released under the MIT License.
 */`

export default {
	input: 'src/index.js',
	output: [
		{
			format: 'umd',
			name: 'resouceCache',
			file: 'dist/resouce-cache.js',
			indent: '\t',
			banner: license
		},
		{
			format: 'es',
			file: 'dist/resouce-cache.module.js',
			indent: '\t',
			banner: license
		}
	],
	// sourceMap: false,
	plugins: [
		babel( { exclude: 'node_modules/**' } )
	]
};
