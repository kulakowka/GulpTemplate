var gulp         = require('gulp');
var babel        = require('gulp-babel');
var jade         = require('gulp-jade');
var uglify       = require('gulp-uglify');
var sourcemaps   = require('gulp-sourcemaps');
var concat       = require('gulp-concat');
var stylus       = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var jscs         = require('gulp-jscs');
var jshint       = require('gulp-jshint');
var rev          = require('gulp-rev');
var browserSync  = require('browser-sync').create();
var del          = require('del');
var stylish      = require('jshint-stylish');
var config       = require('yaml-config');
var CONFIG       = config.readConfig('./config.yaml');

gulp.task('default', ['clean'], function() {

  // assets compile
  gulp.start('templates');
  gulp.start('stylesheets');
  gulp.start('javascripts');

  // developer workspace
  gulp.start('browser-sync');
  gulp.start('watch');
});

gulp.task('rev', function() {
  return gulp.src(['./build/**/*.js', './build/**/*.css'])
    .pipe(rev())
    .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function() {
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

gulp.task('clean', function(cb) {
  del(CONFIG.clean.buildPath, cb);
});

gulp.task('templates', function() {
  return gulp.src(CONFIG.templates.src)
    .pipe(jade(CONFIG.templates.jade))
    .pipe(gulp.dest(CONFIG.templates.dest))
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

gulp.task('javascripts', function() {
  return gulp.src(CONFIG.javascripts.src)
      .pipe(sourcemaps.init())
      .pipe(concat(CONFIG.javascripts.filename))
      .pipe(babel())
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(CONFIG.javascripts.dest))
      .pipe(browserSync.stream());
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

