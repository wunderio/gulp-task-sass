'use strict';

var path = require('path');
var defaultsDeep = require('lodash.defaultsdeep');
var autoprefixer = require('gulp-autoprefixer');
var notifier = require('node-notifier');
var sourcemaps = require('gulp-sourcemaps');
var filter = require('gulp-filter');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var del = require('del');
var gulpif = require('gulp-if');
var changed = require('gulp-changed');

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
    },
    browserSync: false
  };

  var config = defaultsDeep(gulpConfig, defaultConfig);

  // Default watch task.
  gulp.task('sass-watch', function () {
    watch(path.join(config.basePath, config.stylesheets.src))
      .on('change', function(path) {
        gulp.start('sass');
      })
      .on('add', function(path) {
        this.close();
        gulp.start('sass-watch');
      })
      .on('unlink', function(filepath) {
        del(path.join(gulpConfig.basePath, config.stylesheets.dest));
        gulp.start('sass');
      });
  });

  // SASS with sourcemaps.
  gulp.task('sass', function () {
    return gulp.src(path.join(config.basePath, config.stylesheets.src))
      .pipe(sourcemaps.init())
      .pipe(changed(path.join(config.basePath, config.stylesheets.dest), {extension: '.css'}))
      .pipe(filter(function (file) {
        return !/^_/.test(path.basename(file.path));
      }))
      .pipe(sass(config.stylesheets.sassOptions).on('error', sass.logError))
      .pipe(autoprefixer(config.stylesheets.autoprefixerOptions))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(path.join(config.basePath, config.stylesheets.dest)))
      .pipe(gulpif(config.browserSync !== false, config.browserSync.stream({match: "**/*.css"})))
      .on('end', function () {
        notifier.notify({
          title: config.stylesheets.notify.title,
          message: config.stylesheets.notify.message,
          icon: config.notify.successIcon,
          sound: false
        });
      });
  });
  // SASS for production without sourcemaps.
  gulp.task('sass-production', function () {
    return gulp.src(path.join(config.basePath, config.stylesheets.src))
      .pipe(filter(function (file) {
        return !/^_/.test(path.basename(file.path));
      }))
      .pipe(sass(config.stylesheets.sassOptions).on('error', sass.logError))
      .pipe(autoprefixer(config.stylesheets.autoprefixerOptions))
      .pipe(gulp.dest(path.join(config.basePath, config.stylesheets.dest)))
      .on('end', function () {
        notifier.notify({
          title: config.stylesheets.notify.title,
          message: config.stylesheets.notify.message,
          icon: config.notify.successIcon,
          sound: false
        });
      });
  });
};
