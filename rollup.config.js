import babel from 'rollup-plugin-babel'

const license = `/*!
 * resource-cacher
 * https://github.com/yomotsu/resource-cacher
 * (c) 2018 @yomotsu
 * Released under the MIT License.
 */`

export default {
	input: 'src/index.js',
	output: [
		{
			format: 'umd',
			name: 'resourceCacher',
			file: 'dist/resource-cacher.js',
			indent: '\t',
			banner: license
		},
		{
			format: 'es',
			file: 'dist/resource-cacher.module.js',
			indent: '\t',
			banner: license
		}
	],
	// sourceMap: false,
	plugins: [
		babel( { exclude: 'node_modules/**' } )
	]
};
