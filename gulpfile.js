const gulp = require('gulp');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');

gulp.task('rollup', () => {
    return rollup({
        input: './src/inject/main.js',
        format: 'iife',
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['rollup'], () => {
    gulp.watch(['./src/inject/main.js', './src/inject/modal.js', './src/util.js']);
});

