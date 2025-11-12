import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
  // UMD build (for browsers)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/vanilla-slide.js',
      format: 'umd',
      name: 'Slider',
      sourcemap: true,
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: '> 0.25%, not dead'
          }]
        ]
      }),
      production && terser()
    ]
  },
  // ES Module build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/vanilla-slide.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: '> 0.25%, not dead',
            modules: false
          }]
        ]
      })
    ]
  },
  // Minified UMD build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/vanilla-slide.min.js',
      format: 'umd',
      name: 'Slider',
      sourcemap: true,
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: '> 0.25%, not dead'
          }]
        ]
      }),
      terser()
    ]
  }
];
