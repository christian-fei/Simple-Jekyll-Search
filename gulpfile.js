var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');

var browserifyEntryPoint = 'src/index.js';





gulp.task('default', ['js:src','js:test:unit'])

gulp.task('watch', function(){
  gulp.watch(['!'+browserifyEntryPoint,'src/**/*.js'], ['js:src','js:test:unit']);
  gulp.watch(['!test/unit/browserifiedTests.js','test/unit/**/*.js'], ['js:test:unit']);
});






gulp.task('js:src', function() {
  gulp.src(browserifyEntryPoint)
    .pipe(browserify({
      // insertGlobals : true,
      debug : !process.env.PROD
    }))
    .pipe(gulp.dest('./dest/'))
});

gulp.task('js:test:unit', function() {
  gulp.src('test/unit/**/*Test.js')
    .pipe(browserify({
      // insertGlobals : true,
      debug : !process.env.PROD
    }))
    .pipe(rename('browserifiedTests.js'))
    .pipe(gulp.dest('./test/unit/'))
});
