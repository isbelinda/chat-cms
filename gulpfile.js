/**
 * Created by Belinda on 7/25/16.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');


gulp.task('sass', function(){
    return gulp.src('content/scss/*.scss')
        .pipe(sass({
            style: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('content/css'));
});

gulp.task('browser-sync', function(){
    browserSync({
        port: 6010,
        server: {
            baseDir: './'
        }
    })
})

gulp.task('default', ['sass', 'browser-sync'], function(){
    gulp.watch(['*.html'], browserSync.reload);
    gulp.watch(['script/*.js'], browserSync.reload);
    gulp.watch(['content/scss/*.scss'], browserSync.reload);
    gulp.watch("content/scss/*.scss",['sass'])
});
