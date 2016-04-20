var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var uglify = require('gulp-uglifyjs');
var nano = require('gulp-cssnano');
var webserver = require('gulp-webserver');
 
gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('css', function () {
    var stream = (
        gulp.src('./src/css/main.css')
            .pipe(sourcemaps.init())
            .pipe(postcss([
                require("postcss-import")(),
                require("postcss-url")(),
                require("precss")(),
                require("postcss-cssnext")(),
                require("postcss-browser-reporter")(),
                require("postcss-reporter")()
            ]))
            .pipe(nano())
            .pipe(sourcemaps.write('.', {
                includeContent: false,
                sourceRoot: '/src/css/'
            }))
            .pipe(gulp.dest('./dist/css'))
    );
    stream.on('error', function (error) {
        console.log(error);
    });
    return stream;
});

gulp.task('default', ['css', 'js', 'watch', 'webserver']);

gulp.task('js', function () {
    gulp.src([
            './src/js/main.js',
        ])
        .pipe(uglify('main.js', {
            outSourceMap: true,
            sourceRoot: '../..',
            mangle: false,
            compress: {
                drop_debugger: false
            }
        }))
        .pipe(gulp.dest('./dist/js'))
});


gulp.task('watch', function () {
    gulp.watch('./src/css/*.*', ['css']);
    gulp.watch('./src/js/*.js', ['js']);
});