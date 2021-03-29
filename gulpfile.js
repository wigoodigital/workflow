const { src, dest, watch, parallel, series } = require("gulp");

const sass = require('gulp-sass');
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const eslint = require("gulp-eslint");
const sync = require("browser-sync").create();


function generateCSS(cb) {
    // src('./sass/**/*.scss')
    src('./sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({
            basename: "custom",
        }))
        // .pipe(dest('public/css/sass'))
        .pipe(dest('public/css'))
        .pipe(sync.stream());
    cb();
}


function generateHTML(cb) {
    src("./views/**/*.ejs")
        .pipe(ejs({
            title: "Hello Semaphore CI!",
        }))
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(dest("public"));
    cb();
}


function runLinter(cb) {
    return src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format()) 
        .pipe(eslint.failAfterError())
        .on('end', function() {
            cb();
        });
}



function watchFiles(cb) {
    watch('views/**/*.ejs', generateHTML);
    watch('sass/**/*.scss', generateCSS);
    watch([ '**/*.js', '!node_modules/**'], parallel(runLinter));
}


function browserSync(cb) {
    sync.init({
        server: {
            baseDir: "./public"
        }
    });

    watch('views/**.ejs', generateHTML);
    watch('sass/**.scss', generateCSS);
    watch("./public/**.html").on('change', sync.reload);
    watch("./public/css/**.css").on('change', sync.reload);
}


exports.css = generateCSS;
exports.html = generateHTML;
exports.lint = runLinter;
exports.watch = watchFiles;
exports.sync = browserSync;

exports.default = series(parallel(watchFiles, browserSync));