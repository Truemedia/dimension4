import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/main.js',
  format: 'es',
  plugins: [
    nodeResolve({
      // use "jsnext:main" if possible
      jsnext: true
    })
  ],
  output: {
    file: 'browser.js',
    format: 'es'
  }
};