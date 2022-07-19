import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const extensions = ['.ts', '.tsx']
const noDeclarationFiles = { compilerOptions: { declaration: false } }

export default defineConfig([
  // UMD Development
  {
    input: 'src/index.tsx',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      indent: false,
      name: 'wechat-h5-to-mini-program',
      globals: {
        "react": "React",
      },
    },
    plugins: [
      nodeResolve({
        extensions
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelHelpers: 'bundled'
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]
  },

  // UMD Production
  {
    input: 'src/index.tsx',
    output: {
      file: 'dist/index.min.js',
      format: 'umd',
      indent: false,
      name: 'wechat-h5-to-mini-program',
      globals: {
        "react": "React",
      },
    },
    plugins: [
      nodeResolve({
        extensions
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: 'node_modules/**',
        skipPreflightCheck: true,
        babelHelpers: 'bundled'
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true
        }
      })
    ]
  }
])
