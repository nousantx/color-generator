import fs from 'node:fs'
import path from 'node:path'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'))
const name = '__nsx_color_tools'
const banner = `/*!
 * ${packageJson.name} v${packageJson.version} | ${packageJson.license} License
 *
 * Copyright (c) 2024-present NOuSantx <nousantx@gmail.com>
 *
 * Built Date: ${new Date().toString()}
 */`
const config = [
  {
    input: 'src/cli.ts',
    output: [
      {
        file: 'dist/cli.min.js',
        format: 'es',
        plugins: [
          terser({
            format: {
              comments: false,
              preamble: banner
            },
            mangle: true,
            compress: {
              passes: 2
            }
          })
        ]
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
        exports: 'named',
        banner,
        sourcemap: true
      },
      {
        file: 'dist/index.min.cjs',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
        plugins: [
          terser({
            format: {
              comments: false,
              preamble: banner
            },
            mangle: true,
            compress: {
              passes: 2
            }
          })
        ]
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        exports: 'named',
        sourcemap: true,
        name,
        banner
      },
      {
        file: 'dist/index.umd.min.js',
        format: 'umd',
        exports: 'named',
        sourcemap: true,
        name,
        plugins: [
          terser({
            format: {
              comments: false,
              preamble: banner
            }
          })
        ]
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        banner,
        sourcemap: true
      },
      {
        file: 'dist/index.esm.min.js',
        sourcemap: true,
        format: 'es',
        plugins: [
          terser({
            format: {
              comments: false,
              preamble: banner
            },
            mangle: true,
            compress: {
              passes: 2
            }
          })
        ]
      }
    ],
    plugins: [typescript(), resolve(), commonjs()]
  }
]

export default config
