var gulp         = require('gulp');
var babel        = require('gulp-babel');
var jade         = require('gulp-jade');
var uglify       = require('gulp-uglify');
var sourcemaps   = require('gulp-sourcemaps');
var concat       = require('gulp-concat');
var stylus       = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync').create();
var jscs         = require('gulp-jscs');
var jshint       = require('gulp-jshint');
var stylish      = require('jshint-stylish');
var config       = require('yaml-config');
var CONFIG       = config.readConfig('./config.yaml');

gulp.task('templates', function() {
  return gulp.src(CONFIG.templates.src)
    .pipe(jade(CONFIG.templates.jade))
    .pipe(gulp.dest(CONFIG.templates.dest))
    .pipe(browserSync.stream());
});

gulp.task('javascripts', function() {
  return gulp.src(CONFIG.javascripts.src)
      .pipe(sourcemaps.init())
      .pipe(jscs())
      .pipe(babel())
      .pipe(uglify())
      .pipe(concat(CONFIG.javascripts.filename))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(CONFIG.javascripts.dest))
      .pipe(browserSync.stream());
});

gulp.task('stylesheets', function() {
  return gulp.src(CONFIG.stylesheets.src)
    .pipe(sourcemaps.init())
    .pipe(stylus(CONFIG.stylus))
    .pipe(autoprefixer(CONFIG.autoprefixer))
    .pipe(concat(CONFIG.stylesheets.filename))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(CONFIG.stylesheets.dest))
    .pipe(browserSync.stream());
});

gulp.task('watch', ['templates', 'javascripts', 'stylesheets'], function() {
  gulp.watch(CONFIG.templates.src, ['templates']);
  gulp.watch(CONFIG.javascripts.src, ['javascripts']);
  gulp.watch(CONFIG.stylesheets.src, ['stylesheets']);
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: CONFIG.browserSync.baseDir,
    },
  });
});

gulp.task('jscs', function() {
  return gulp.src(CONFIG.javascripts.src)
      .pipe(jscs({
        esnext: true,
      }));
});

gulp.task('jshint', function() {
  return gulp.src(CONFIG.javascripts.src)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('default', ['watch', 'browser-sync'], function() {
  // place code for your default task here
});
