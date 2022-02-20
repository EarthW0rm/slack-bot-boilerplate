/* eslint-disable camelcase */
const gulp = require('gulp');
const {series, watch} = require('gulp');
const webpack = require('webpack-stream');

const webpackDev = require('./webpack.dev.js');
const webpackPrd = require('./webpack.prod.js');

const nodemon = require('gulp-nodemon');

/**
  * @param {*} cb
 */
function build(cb) {
  gulp
      .src('src/index.ts')
      .pipe(
          webpack(
          process.env.NODE_ENV === 'development' ? webpackDev : webpackPrd))
      .pipe(gulp.dest('dist/'));

  cb();
}

/**
 * @param {*} cb
 */
function watch_app(cb) {
  watch(['src/**/*.js'], series(build));
  cb();
}

/**
 * @param {*} cb
 */
function develop(cb) {
  const stream = nodemon({
    script: './dist/index.js',
    ext: 'html js',
    ignore: ['ignored.js'],
    tasks: ['lint'],
    done: cb});

  stream
      .on('restart', function() {
        console.log('restarted!');
      })
      .on('crash', function() {
        console.error('Application has crashed!\n');
        stream.emit('restart', 10); // restart the server in 10 seconds
      });
}

exports.watch = series(watch_app, develop);
exports.default = build;
