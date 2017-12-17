import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

const env = process.env.NODE_ENV
const config = {
	input: 'src/index.js',
	plugins: []
}

if (env === 'es' || env === 'cjs') {
	config.output = { format: env }
	config.external = ['symbol-observable']
	config.plugins.push(
		babel({
			plugins: ['external-helpers'],
		})
	)
}

if (env === 'development' || env === 'production') {
	config.output = {
		format: 'umd',
		globals: {
			redux: 'Redux',
			mithril: 'm'
		}
	}
	config.name = 'Mithril Redux'
	config.plugins.push(
		commonjs({
			namedExports : {
				"node_modules/ramda/index.js" : Object.keys(require("ramda"))
			}
		}),
		babel({
			exclude: 'node_modules/**',
			plugins: ['external-helpers'],
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify(env)
		})
	)
}

if (env === 'production') {
	config.plugins.push(
		uglify({
			compress: {
				pure_getters: true,
				unsafe: true,
				unsafe_comps: true,
				warnings: false
			}
		})
	)
}

export default config
