'use strict';

var jshint     = require('gulp-jshint');
var gulp       = require('gulp');
var istanbul   = require('gulp-istanbul');
var mocha      = require('gulp-mocha');

gulp.task('lint', function() {
    return gulp.src(['./lib/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});


gulp.task('test', ['lint'], function(){

    return gulp.src(['./lib/**/*.js'])
        .pipe(istanbul()) // Covering files
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
          gulp.src(['test/**/*.js'])
            .pipe(mocha())
            .pipe(istanbul.writeReports({reporters: ['text', 'text-summary']}))
            .once('error', function () {
                process.exit(1);
            })
            .once('end', function () {
                process.exit(0);
            });
        });

});
