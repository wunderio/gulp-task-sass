'use strict';

var path = require('path');
var defaultsDeep = require('lodash.defaultsdeep');
var autoprefixer = require('gulp-autoprefixer');
var notifier = require('node-notifier');
var sourcemaps = require('gulp-sourcemaps');

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
  gulp.task('sass-watch', ['sass'], function () {
    gulp.watch(path.join(gulpConfig.basePath, config.src), ['sass'])
  });

  // SASS with sourcemaps.
  gulp.task('sass', function () {
    return gulp.src(path.join(gulpConfig.basePath, config.src))
      .pipe(filter(function (file) {
        return !/^_/.test(path.basename(file.path));
      }))
      .pipe(sourcemaps.init())
      .pipe(sass(config.sassOptions).on('error', sass.logError)
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
  };

};
