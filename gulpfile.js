/**
 * Created by Belinda on 7/25/16.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

var path = {
    scssSrc: 'contents/scss/*.scss'
}

gulp.task('sass', function(){
    return gulp.src(path.scssSrc)
        .pipe(sass({
            style: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('contents/css'));
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
    gulp.watch(['views/**/*.html'], browserSync.reload);
    gulp.watch(['scripts/*.js'], browserSync.reload);
    gulp.watch([path.scssSrc], browserSync.reload);
    gulp.watch(path.scssSrc,['sass'])
});
