var gulp = require('gulp')
  , browserify = require('gulp-browserify')
  , rename = require('gulp-rename')
  , using = require('gulp-using')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , karma = require('gulp-karma')
  , jshint = require('gulp-jshint')

var ENTRYPOINT = {
  JS: 'src/index.js'
}

var FILES = {
  JS: 'src/**/*.js',
  TEST: 'src/**/*.test.js'
}




gulp.task('default', ['js:src','lint'])

gulp.task('watch',['default', 'js:test:unit'], function(){
  gulp.watch(['!'+ENTRYPOINT.JS,FILES.TEST], ['js:src','js:test:unit'])
  gulp.watch([FILES.JS], ['lint'])
  gulp.watch([FILES.TEST], ['js:test:unit'])
})




gulp.task('lint', function() {
  return gulp.src(['src/**/*.js','!'+FILES.TEST])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task('js:src', function() {
  gulp.src(ENTRYPOINT.JS)
    .pipe(browserify({
      debug : !process.env.PROD
    }))
    .pipe(rename('jekyll-search.js'))
    .pipe(gulp.dest('./dest/'))
    .pipe(uglify({mangle: false,compress:true}))
    .pipe(rename('jekyll-search.min.js'))
    .pipe(gulp.dest('./dest/'))
})

gulp.task('js:test:unit', function() {
  return gulp.src([FILES.TEST])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      this.emit('end')
      throw err
    })
})
