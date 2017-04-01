var gulp = require('gulp');
var minifyCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');

var jsFiles = [
    'www/lib/js/jquery-1.12.3.min.js',
    'www/lib/js/moment.min.js',
    "www/lib/js/underscore-min.js",
    "www/lib/angular/angular.min.js",
    "www/lib/angular/angular-locale_zh-cn.js",
    "www/lib/angular/angular-animate.min.js",
    "www/lib/angular/angular-touch.min.js",
    "www/lib/angular/angular-cookies.min.js",
    "www/lib/angular/angular-resource.min.js",
    "www/lib/angular/angular-route.min.js",
    "www/lib/angular_ui/angular-ui-router.js",
    "www/lib/angular_ui/ui-bootstrap.js",
    "www/lib/qrcode/qrgen.min.js",
    "www/lib/bootstrap/js/bootstrap.min.js",
    "www/lib/js/simply-toast.js",
    "www/lib/js/raven.min.js",
    "www/lib/js/ng-infinite-scroll.js",
    "www/lib/js/ng-file-upload.min.js",
    "www/lib/angular-perfect-scrollbar/perfect-scrollbar.min.js",
    "www/lib/angular-perfect-scrollbar/angular-perfect-scrollbar.js",
    "www/lib/js/api-check.js",
    "www/lib/js/formly.js",
    "www/lib/js/angular-formly-templates-bootstrap.js",
    "www/lib/ui-select/select.js",
    "www/lib/angular-ui-tree/angular-ui-tree.js",
    "www/lib/highcharts-ng/highcharts-ng.js",
    "www/service/city_data.js",
    "www/base/config.js",
    "www/base/config_ex.js",
    "www/base/app.js",
    "www/service/services.js",
    "www/service/upload.js",
    "www/filter/filter.js",
    "www/directive/directive.js",
    "www/form/form.js",
    "www/app/**/*.js"

];
var autoprefixerOptions = {
    browsers: [
        'last 2 versions',
        'iOS >= 7',
        'Android >= 4',
        'Explorer >= 10',
        'ExplorerMobile >= 11'
    ],
    cascade: false
};
gulp.task('sass', function () {
    return gulp.src('scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(minifyCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest('www/css/'))
        .pipe(browserSync.stream());
});
gulp.task('script', function () {
    return gulp.src(jsFiles) //注意，此处特意如此，避免顺序导致的问题
        // .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        // .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest('build/js/'))
});
gulp.task('html', function () {
    return gulp.src('www/index.html', {base: "www"})
        .pipe(htmlreplace({
            'js': 'js/all.min.js'
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('build-css', ['sass'], function () {
    return gulp.src('www/**/*.css')
        .pipe(gulp.dest('build/'));
});

gulp.task('build-js', function () {
    return gulp.src('www/**/*.{png,jpg,gif,jpeg,bmp}', {base: 'www'})
        .pipe(gulp.dest('build/'));
});

gulp.task('build-image', function () {
    return gulp.src(['www/**/*.png', 'www/**/*.jpg', 'www/**/*.git', 'www/**/*.bmp'], {base: 'www'})
        .pipe(gulp.dest('build/'));
});

gulp.task('build-other', function () {
    return gulp.src(['www/lib/bootstrap/fonts/**', 'www/lib/highcharts/**', 'www/**/*.html', '!www/index.html'], {base: 'www'})
        .pipe(gulp.dest('build/'));
});

gulp.task('w', ['sass'], function () {
    gulp.watch("scss/**/*.scss", ['sass'])
});


gulp.task('serve', ['sass'], function () {

    browserSync.init({
        server: "./www"
    });

    gulp.watch("scss/**/*.scss", ['sass']);
    gulp.watch("www/**/*.html").on('change', browserSync.reload);
    gulp.watch("www/**/*.js").on('change', browserSync.reload);
});

gulp.task('default', ["sass"]);

gulp.task('build', ['script', 'html', 'build-css', 'build-js', 'build-image', 'build-other']);