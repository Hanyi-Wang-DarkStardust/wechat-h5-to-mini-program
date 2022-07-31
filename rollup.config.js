import path from 'path';
import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.resolve(__dirname, './package.json'));

const extensions = ['.ts', '.tsx', '.js', '.jsx'];
const noDeclarationFiles = { compilerOptions: { declaration: false } };
const external = [...Object.keys(pkg.peerDependencies || {})].map(externalName => RegExp(`^${externalName}($|/)`));
const { name } = pkg;
const inputDir = 'src/index.tsx';

export default defineConfig([
  // ESM Development
  {
    input: inputDir,
    output: {
      file: 'lib/index.js',
      format: 'esm',
      indent: false,
      name,
    },
    external,
    plugins: [
      nodeResolve({
        extensions,
        browser: true,
        preferBuiltins: true,
      }),
      commonjs({}),
      typescript(),
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        configFile: path.resolve(__dirname, 'babel.config.js'),
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
  },

  
  // UMD Development
  {
    input: inputDir,
    output: {
      file: 'dist/index.js',
      format: 'umd',
      indent: false,
      name,
      globals: {
        "react": "React",
      },
    },
    external,
    plugins: [
      nodeResolve({
        extensions,
        browser: true,
        preferBuiltins: true,
      }),
      commonjs({}),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        configFile: path.resolve(__dirname, 'babel.config.js'),
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
  },

  // UMD Production
  {
    input: inputDir,
    output: {
      file: 'dist/index.min.js',
      format: 'umd',
      indent: false,
      name,
      globals: {
        "react": "React",
      },
    },
    external,
    plugins: [
      nodeResolve({
        extensions,
        browser: true,
        preferBuiltins: true,
      }),
      commonjs({}),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: 'node_modules/**',
        skipPreflightCheck: true,
        babelHelpers: 'bundled',
        configFile: path.resolve(__dirname, 'babel.config.js'),
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser({
        compress: true,
        format: {
          comments: false,
        },
      }),
    ],
  },
])
