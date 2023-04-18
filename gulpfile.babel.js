var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    Promise = require('es6-promise').polyfill(),
    watch = require('gulp-watch'),
    errorHandler = require('gulp-error-handle'),
    sourcemaps = require('gulp-sourcemaps'),
    ext_replace = require('gulp-ext-replace'),
    autoprefixer = require('gulp-autoprefixer'),
    babel  = require('gulp-babel'),
    imagemin = require("gulp-imagemin"),
    webp = require("imagemin-webp"),
    penthouse = require('penthouse'),
    fs = require('fs');


function fontAwesome() {
    return gulp
        .src('node_modules/@fortawesome/fontawesome-pro/webfonts/**.*')
        .pipe(gulp.dest('dist/fonts/webfonts'));
}

function change() {
    return gulp
        .src([
            'node_modules/glightbox/dist/css/glightbox.css',
            'node_modules/choices.js/public/assets/styles/choices.css',
            'node_modules/ion-rangeslider/css/ion.rangeSlider.css',
            'node_modules/overlayscrollbars/css/OverlayScrollbars.css',
            'node_modules/tippy.js/dist/tippy.css',
            'node_modules/aos/dist/aos.css'
        ])
        .pipe(ext_replace('.scss'))
        .pipe(gulp.dest('src/scss/node-imports'));
}

function styles() {
    return (
        gulp
            .src('src/scss/app.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                cascade: false
            }))
            .pipe(cssnano({ zindex: false }))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('web/dist/css'))
    );
}

function scripts() {
    return (
        gulp
            .src([
                'node_modules/jquery/dist/jquery.js',
                'node_modules/sweetalert/dist/sweetalert.min.js',
                'node_modules/jquery-validation/dist/jquery.validate.js',
                'node_modules/choices.js/public/assets/scripts/choices.js',
                'node_modules/swiper/swiper-bundle.js',
                'node_modules/vanilla-lazyload/dist/lazyload.js',
                'node_modules/glightbox/dist/js/glightbox.js',
                'node_modules/ion-rangeslider/js/ion.rangeSlider.js',
                'node_modules/aos/dist/aos.js',
                'node_modules/overlayscrollbars/js/jquery.overlayScrollbars.js',
                'node_modules/smooth-scroll/dist/smooth-scroll.js',
                'node_modules/select2/dist/js/select2.full.js',
                'node_modules/dropzone/dist/dropzone-min.js',
                'node_modules/infinite-scroll/dist/infinite-scroll.pkgd.js',
                'node_modules/universal-parallax/dist/universal-parallax.min.js',
                'src/js/active/**/*.js',
            ])
            // .pipe(sourcemaps.init())
            .pipe(errorHandler())
            .pipe(concat('main.js'))
            .pipe(rename({ suffix: '.min' }))
            .pipe(uglify())
            // .pipe(sourcemaps.write())
            .pipe(gulp.dest('web/dist/js/'))
    );
}
function watchFiles() {
    // gulp.watch('src/scss/**/*.scss', gulp.series('styles', criticalCSS));
    gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
    gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
    gulp.watch('src/js/active/**/*.js', gulp.series('scripts'));
}

async function criticalCSS() {
    criticalPages.map(function(page) {
        penthouse({
            url: page.url,
            css: 'dist/css/app.v2.min.css',
            width: 1280,
            height: 2500
        }, function(err, data) {
            fs.writeFile('dist/css/critical/' + page.name + '.css', data, function(err, result) {
                if(err) console.log('error', err);
            });
        });
    });
}

gulp.task('scripts', scripts);
gulp.task('styles', styles);
gulp.task('fontAwesome', fontAwesome);
gulp.task('change', change);
gulp.task('criticalCSS', criticalCSS);

gulp.task(
    'default',
    gulp.series(
        change,
        scripts,
        styles,
        // criticalCSS,
    )
);

gulp.task('watch', function() {
    watchFiles();
});
