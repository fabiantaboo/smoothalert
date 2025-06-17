import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';

const isProduction = !process.env.ROLLUP_WATCH;

export default [
  // ES Module build
  {
    input: 'src/smoothalert.js',
    output: {
      file: 'dist/smoothalert.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              esmodules: true
            },
            modules: false
          }]
        ]
      }),
      isProduction && terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      }),
      filesize()
    ].filter(Boolean)
  },
  
  // CommonJS build
  {
    input: 'src/smoothalert.js',
    output: {
      file: 'dist/smoothalert.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'default'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              node: '12'
            },
            modules: false
          }]
        ]
      }),
      isProduction && terser(),
      filesize()
    ].filter(Boolean)
  },
  
  // Minified ES Module build
  {
    input: 'src/smoothalert.js',
    output: {
      file: 'dist/smoothalert.esm.min.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              esmodules: true
            },
            modules: false
          }]
        ]
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
          drop_console: true,
          drop_debugger: true
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false
        }
      }),
      filesize()
    ]
  }
]; 