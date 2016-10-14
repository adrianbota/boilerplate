var gulp = require('gulp');
var del = require('del');
var webpack = require('webpack-stream');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var fileinclude = require('gulp-file-include');
var htmlmin = require('gulp-htmlmin');
var jasmine = require('gulp-jasmine-browser');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');

/**
 * Cleanup
 * - delete `dist` folder contents
 * - delete `docs` folder contents
 * - skip .gitkeep
 */
gulp.task('clean', function () {
  return del.sync([
    'dist/**/*',
    'docs/**/*',
    '!dist/.gitkeep',
    '!docs/.gitkeep'
  ]);
});

/**
 * Scripts
 * - bundle
 * - minify
 * - copy
 */
gulp.task('js', function () {
  return gulp.src('src/js/main.js')
    .pipe(webpack({ output: { filename: 'main.js' }}))
    .pipe(uglify())
    .pipe(gulp.dest('docs/js/'));
});

/**
 * Styles
 * - compile LESS
 * - auto-prefix
 * - minify
 * - copy
 * - stream
 */
gulp.task('css', function () {
  return gulp.src('src/less/main.less')
    .pipe(less())
    .pipe(postcss([
      autoprefixer({ browsers: ['last 2 versions'] }),
      cssnano()
    ]))
    .pipe(gulp.dest('docs/css/'))
    .pipe(browserSync.stream());
});

/**
 * HTML
 * - compile
 * - minify
 * - copy
 */
gulp.task('html', function () {
  return gulp.src('src/index.html')
    .pipe(fileinclude())
    .pipe(htmlmin({
      caseSensitive: true,
      collapseWhitespace: true,
      removeComments: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true
    }))
    .pipe(gulp.dest('docs/'));
});

/**
 * Images
 * - compress
 * - copy
 */
gulp.task('img', function () {
  return gulp.src('src/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('docs/img/'));
});

/**
 * Tests
 * - bundle
 * - run
 */
gulp.task('test', function () {
  return gulp.src('test/**/*-spec.js')
    .pipe(webpack())
    .pipe(jasmine.specRunner({ console: true }))
    .pipe(jasmine.headless());
});

/**
 * Build
 * - clean
 * - scripts
 * - styles
 * - html
 */
gulp.task('build', ['clean', 'js', 'css', 'html', 'img']);

/**
 * Dev mode
 * - build
 * - server
 * - watch
 */
gulp.task('dev', ['build'], function () {
  browserSync.init({ server: 'docs/' });
  gulp.watch('src/less/**/*.less', ['css']);
  gulp.watch('src/js/**/*.js', ['js']).on('change', browserSync.reload);
  gulp.watch('src/**/*.html', ['html']).on('change', browserSync.reload);
  gulp.watch('src/img/**/*', ['img']).on('change', browserSync.reload);
});

/**
 * Default
 * - tests
 * - build
 */
gulp.task('default', ['test', 'build']);
