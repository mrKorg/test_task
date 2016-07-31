var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css');

gulp.task('minif-and-save', function () {
    return gulp.src('style/css/style.css')
        .pipe(minifyCSS())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('style/css/'));
});
gulp.task('gulp-sass', function() {
    gulp.src('style/css/style.sass')
        .pipe(sass())
        .pipe(gulp.dest('style/css/'));
});
gulp.task('watch', function () {
    gulp.watch('style/css/style.sass', ['gulp-sass']);
    gulp.watch('style/css/style.css', ['minif-and-save']);
});