const gulp = require('gulp');
const ts = require("gulp-typescript");
const cache = require("gulp-cached");

const tsFiles = ['src/**/*.ts', 'src/**/*.tsx']

var tsProject = ts.createProject('tsconfig.json');

gulp.task('compile', function(done) {
  return gulp.src(tsFiles)
      .pipe(cache('tsc'))
      .pipe(tsProject())
      .pipe(gulp.dest('lib'));
});

gulp.task('copy-to-example-modules', function(done) {
  return gulp
    .src(['lib/**/*.js', 'lib/**/*.d.ts'])
    .pipe(cache('tscopy'))
    .pipe(gulp.dest('example/node_modules/react-native-easy-dnd/lib'));
});


gulp.task('watch', function () {
  gulp.watch(tsFiles, gulp.series('compile', 'copy-to-example-modules'));
});