import babel from 'rollup-plugin-babel'

const license = `/*!
 * resource-cache
 * https://github.com/yomotsu/resource-cache
 * (c) 2018 @yomotsu
 * Released under the MIT License.
 */`

export default {
	input: 'src/index.js',
	output: [
		{
			format: 'umd',
			name: 'resouceCache',
			file: 'dist/resource-cache.js',
			indent: '\t',
			banner: license
		},
		{
			format: 'es',
			file: 'dist/resource-cache.module.js',
			indent: '\t',
			banner: license
		}
	],
	// sourceMap: false,
	plugins: [
		babel( { exclude: 'node_modules/**' } )
	]
};
