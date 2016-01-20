'use strict';

var path = require('path');
var defaultsDeep = require('lodash.defaultsdeep');
var autoprefixer = require('gulp-autoprefixer');
var notifier = require('node-notifier');
var sourcemaps = require('gulp-sourcemaps');
var filter = require('gulp-filter');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var del = require('del');

module.exports = function (gulp, gulpConfig) {

  gulpConfig = gulpConfig || { basePath: '.' };

  // Merge default config with gulp config.
  var defaultConfig = {
    stylesheets: {
      src: '/sass/**/*.scss',
      dest: '/css',
      sassOptions: {
        includePaths: [
          path.join(gulpConfig.basePath, '/vendor')
        ]
      },
      autoprefixerOptions: {
        browsers: ['last 2 versions'],
        cascade: false
      },
      notify: {
        title: 'Wunderkraut',
        message: 'SASS compiled.'
      }
    }
  };

  var config = defaultsDeep(gulpConfig, defaultConfig).stylesheets;

  // Default watch task.
  gulp.task('sass-watch', function () {
    watch(path.join(gulpConfig.basePath, config.src), batch(function (events, done) {
      gulp.start('sass', done);
    }))
      .on('add', function(path) {
        this.close();
        gulp.start('sass-watch');
      })
      .on('unlink', function(filepath) {
        del(path.join(gulpConfig.basePath, config.dest));
        gulp.start('sass');
      });
  });

  // SASS with sourcemaps.
  gulp.task('sass', function () {
    return gulp.src(path.join(gulpConfig.basePath, config.src))
      .pipe(filter(function (file) {
        return !/^_/.test(path.basename(file.path));
      }))
      .pipe(sourcemaps.init())
      .pipe(sass(config.sassOptions).on('error', sass.logError))
      .pipe(autoprefixer(config.autoprefixerOptions))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.join(gulpConfig.basePath, config.dest)))
      .on('end', function () {
        notifier.notify({
          title: config.notify.title,
          message: config.notify.message,
          icon: gulpConfig.notify.successIcon,
          sound: false
        });
      });
  });
  // SASS for production without sourcemaps.
  gulp.task('sass-production', function () {
    return gulp.src(path.join(gulpConfig.basePath, config.src))
      .pipe(filter(function (file) {
        return !/^_/.test(path.basename(file.path));
      }))
      .pipe(sass(config.sassOptions).on('error', sass.logError))
      .pipe(autoprefixer(config.autoprefixerOptions))
      .pipe(gulp.dest(path.join(gulpConfig.basePath, config.dest)))
      .on('end', function () {
        notifier.notify({
          title: config.notify.title,
          message: config.notify.message,
          icon: gulpConfig.notify.successIcon,
          sound: false
        });
      });
  });
};
