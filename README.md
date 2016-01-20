Gulp task for SCSS style SASS compilation
=================


## Installation
```sh
npm install --save-dev wunderkraut/gulp-task-sass
```

## Usage

### Basic usage

```js
// Require gulp.
var gulp = require('gulp')

// Require task module and pass gulp to provide the gulp tasks.
require('gulp-task-sass')(gulp)
```

### Advanced usage
You can also pass a configuration to the task. This allows you to overwrite the default configuration and provide other configuration like a base path for your files.

#### gulpfile.js
```js
var gulp = require('gulp')
var gulpConfig = require('./gulpconfig')

// Just pass the configuration object as second parameter.
require('gulp-task-sass')(gulp, gulpConfig)
```

#### gulpconfig.js
```js
var path = require('path');

module.exports = {
  // Basic configuration.
  basePath: '.',

  // Overwrite default configurations.
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
      title: 'YOURTITLE',
      message: 'SASS compiled.'
    }
  }
}
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/wunderkraut/gulp-task-sass/issues/new).
