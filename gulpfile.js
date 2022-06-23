const gulp = require('gulp');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const jsImport = require('gulp-js-import');
const sourcemaps = require('gulp-sourcemaps');
const htmlPartial = require('gulp-html-partial');
const clean = require('gulp-clean');
const isProd = process.env.NODE_ENV === 'prod';

const htmlFile = [
    'src/*.html'
]

function html() {
    return gulp.src(htmlFile)
        .pipe(htmlPartial({
            basePath: 'src/partials/'
        }))
        .pipe(gulpIf(isProd, htmlmin({
            collapseWhitespace: true
        })))
        .pipe(gulp.dest('docs'));
}

function media(){
	return gulp.src('src/media/*')
        .pipe(gulp.dest('docs/media/'));
}

function fonts(){
	return gulp.src('src/fonts/*')
        .pipe(gulp.dest('docs/fonts/'));
}

function css() {
    return gulp.src('src/sass/style.scss')
        .pipe(gulpIf(!isProd, sourcemaps.init()))
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(gulpIf(!isProd, sourcemaps.write()))
        .pipe(gulpIf(isProd, cssmin()))
        .pipe(gulp.dest('docs/css/'));
}

function js() {
    return gulp.src('src/js/*.js')
        .pipe(jsImport({
            hideConsole: true
        }))
        .pipe(concat('all.js'))
        // .pipe(gulpIf(isProd, uglify()))
        .pipe(gulp.dest('docs/js'));
}

function img() {
    return gulp.src('src/img/*')
        .pipe(gulpIf(isProd, imagemin()))
        .pipe(gulp.dest('docs/img/'));
}

function serve() {
    browserSync.init({
        open: false,
        watchr: './docs'
    });
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}


function watchFiles() {
    gulp.watch('src/**/*.html', {interval: 1000, usePolling: true}, gulp.series(html, browserSyncReload));
    gulp.watch('src/**/*.scss', {interval: 1000, usePolling: true}, gulp.series(css, browserSyncReload));
    gulp.watch('src/**/*.js', {interval: 1000, usePolling: true}, gulp.series(js, browserSyncReload));
    gulp.watch('src/img/**/*.*', {interval: 1000, usePolling: true}, gulp.series(img));
    gulp.watch('src/fonts/**/*.*', {interval: 1000, usePolling: true}, gulp.series(fonts));

    return;
}

function del() {
    return gulp.src('docs/*', {read: false})
        .pipe(clean());
}

exports.css = css;
exports.html = html;
exports.js = js;
exports.media = media;
exports.fonts = fonts;
exports.del = del;
exports.watch = gulp.parallel(html, css, js, img, fonts, media, watchFiles, serve);
exports.default = gulp.series(del, html, css, js, img, media, fonts);