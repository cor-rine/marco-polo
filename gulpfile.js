var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var CSS_DIR = './public/css';
var SASS_DIR = './public/scss/**/*.scss';


// Sass Tasks
// Sass local task
gulp.task('sass-local', function () {
  return gulp.src(SASS_DIR)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true
    }))
    .pipe(gulp.dest(CSS_DIR));
});

// Sass dev task
gulp.task('sass-dev', function () {
  return gulp.src(SASS_DIR)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true
    }))
    .pipe(gulp.dest(CSS_DIR));
});


// Watch task - watch the files for changes 
gulp.task('watch', function () {
  gulp.watch(SASS_DIR, ['sass-local']);
});



// TASKS
gulp.task('local', ['watch']);

gulp.task('dev', ['sass-dev']);