var gulp = require('gulp')
  , browserify = require('gulp-browserify')
  , rename = require('gulp-rename')
  , using = require('gulp-using')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , karma = require('gulp-karma')

var ENTRYPOINT = {
  JS: 'src/index.js'
}




gulp.task('default', ['js:src','js:test:unit'])

gulp.task('watch',['default'], function(){
  gulp.watch(['!'+ENTRYPOINT.JS,'src/**/*.test.js'], ['js:src','js:test:unit'])
  gulp.watch(['src/**/*.test.js'], ['js:test:unit'])
})






gulp.task('js:src', function() {
  gulp.src(ENTRYPOINT.JS)
    .pipe(browserify({
      debug : !process.env.PROD
    }))
    .pipe(uglify({mangle: false,compress:true}))
    .pipe(rename('jekyll-search.js'))
    .pipe(gulp.dest('./dest/'))
})

gulp.task('js:test:unit', function() {
  return gulp.src(['src/**/*.test.js'])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      this.emit('end')
      throw err
    })
})
