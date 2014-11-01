var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var using = require('gulp-using');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var browserifyEntryPoint = 'src/index.js';





gulp.task('default', ['js:src','js:test:unit'])

gulp.task('watch',['default'], function(){
  gulp.watch(['!'+browserifyEntryPoint,'src/**/*.js'], ['js:src','js:test:unit']);
  gulp.watch(['!test/unit/browserifiedTests.js','test/unit/**/*Test.js'], ['js:test:unit']);
});






gulp.task('js:src', function() {
  gulp.src(browserifyEntryPoint)
    .pipe(browserify({
      // insertGlobals : true,
      debug : !process.env.PROD
    }))
    .pipe(uglify({mangle: false,compress:true}))
    .pipe(rename('jekyll-search.js'))
    .pipe(gulp.dest('./dest/'))
});

gulp.task('js:test:unit', function() {
  gulp.src(['test/unit/**/*Test.js'])
    .pipe(using())
    .pipe(concat('browserifiedTests.js'))
    .pipe(browserify({
      // insertGlobals : true,
      debug : !process.env.PROD
    }))
    .pipe(using())
    .pipe(gulp.dest('./test/unit/'))
});
