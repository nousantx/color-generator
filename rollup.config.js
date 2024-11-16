import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

const name = '__nsx_color_tools'

const config = [
  {
    input: 'src/cli.ts',
    output: [
      {
        file: 'dist/cli.js',
        format: 'es'
      },
      {
        file: 'dist/cli.min.js',
        format: 'es',
        plugins: [terser()]
      }
    ],
    plugins: [typescript(), resolve(), commonjs()]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs'
      },
      {
        file: 'dist/index.min.cjs',
        format: 'cjs',
        plugins: [terser()]
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name
      },
      {
        file: 'dist/index.umd.min.js',
        format: 'umd',
        plugins: [terser()],
        name
      },
      {
        file: 'dist/index.esm.js',
        format: 'es'
      },
      {
        file: 'dist/index.esm.min.js',
        format: 'es',
        plugins: [terser()]
      }
    ],
    plugins: [typescript(), resolve(), commonjs()]
  }
]

export default config
