const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");
const babel = require('gulp-babel');
const newer = require('gulp-newer');
const del = require('del');
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;

gulp.task("sass", () => {
    return gulp.src(["src/scss/**/*.scss"])
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: notify.onError({
                "message": "Error: <%= error.message %>",
                "title": "SASS"
            })
        }))
        .pipe(sass())
        .pipe(autoprefixer({ browsers: ['last 3 versions'] }))
        .pipe(concat('style.css'))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(plumber.stop())
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    return gulp.src(['src/js/*.js'])
        .pipe(plumber({
            errorHandler: notify.onError({
                "message": "Error: <%= error.message %>",
                "title": "JAVASCRIPT",
            })
        }))
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat("main.js"))
        .pipe(plumber.stop())
        .pipe(gulp.dest('build/js'))
        .pipe(reload({ stream: true }))
});

gulp.task('html', () => {
    return gulp.src(["src/*.html"])
        .pipe(htmlmin({ collapseWhitespace: true, minifyJS: true, removeComments: true }))
        .pipe(gulp.dest('build'))
        .pipe(reload({ stream: true }))

});

gulp.task('fonts', () => {
    return gulp.src(['src/fonts/**/*'])
        .pipe(newer("build/fonts"))
        .pipe(gulp.dest('build/fonts'))
        .pipe(reload({ stream: true }))
});

gulp.task('images', () => {
    return gulp.src(['src/images/*'])
        .pipe(newer("build/images"))
        .pipe(gulp.dest('build/images'))
});

gulp.task('imagesmin', () => {
    return gulp.src(['src/images/*'])
        .pipe(newer("build/images"))
        .pipe(imagemin({
            pngquant: true,
            optipng: true,
            zopflipng: false,
            jpegRecompress: false,
            jpegoptim: true,
            mozjpeg: true,
            guetzli: false,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
        }))
        .pipe(gulp.dest('build/images'))
});

gulp.task('browser-sync', () => {
    return browserSync.init({ server: "build" });
});

gulp.task('serve', ['sass', "fonts", "html", "js", "images", "browser-sync"], () => {
    gulp.watch("src/scss/**/*.scss", ['sass']);
    gulp.watch("src/fonts/**/*", ['fonts']);
    gulp.watch("src/images/*", ['images']);
    gulp.watch("src/*.html", ['html']);
    gulp.watch("src/js/*.js", ["js"]);
});

gulp.task('final', ['sass', "fonts", "html", "js", "imagesmin"])

gulp.task('default', ['serve']);

gulp.task('clean', () => {
    del.sync(['build/**']);
});