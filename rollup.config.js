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
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/index.min.cjs',
        format: 'cjs',
        sourcemap: true,
        plugins: [terser()]
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        sourcemap: true,
        name
      },
      {
        file: 'dist/index.umd.min.js',
        format: 'umd',
        sourcemap: true,
        plugins: [terser()],
        name
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true
      },
      {
        file: 'dist/index.esm.min.js',
        sourcemap: true,
        format: 'es',
        plugins: [terser()]
      }
    ],
    plugins: [typescript(), resolve(), commonjs()]
  }
]

export default config
