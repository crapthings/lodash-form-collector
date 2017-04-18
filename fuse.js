const fsbx = require('fuse-box')

const fuse = new fsbx.FuseBox({
  package: 'lodash-form-collector',
  homeDir: 'src/',
  sourcemaps: true,
  outFile: './dist/bundle.js',
  plugins: [
    fsbx.BabelPlugin(),
    fsbx.UglifyJSPlugin(),
  ],
})

fuse.bundle('[lfc.js]')
