import gulp from 'gulp'
const { src, dest, task, watch, series } = gulp
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass)
import browserSync from 'browser-sync'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import sourcemaps from 'gulp-sourcemaps'
import cssnano from 'cssnano'
const plugins = [
  autoprefixer({
    cascade: false,
    grid: 'autoplace',
    flexbox: 'no-2009',
    overrideBrowserslist: 'last 100 versions',
  }),
  cssnano({ preset: 'advanced' }),
]
// Compile to SCSS

task('scss', async () => {
  src([
    './node_modules/bootstrap/dist/css/bootstrap.min.css',
    './node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css',
    './src/scss/**/*.{scss,sass}',
  ])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./src/css'))
    .pipe(browserSync.stream())
})

task('js', async () => {
  src([
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/@popperjs/core/dist/cjs/popper.js',
  ])
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./src/js'))
    .pipe(browserSync.stream())
})

task('fonts', async () => {
  src([
    './node_modules/@fortawesome/fontawesome-free/webfonts/**/*.{otf,woff,woff2,eot,ttf,svg}',
  ]).pipe(dest('./src/fonts'))
})

task('watch', function () {
  browserSync.init({
    server: {
      baseDir: './src',
    },
  })
  watch(
    ['./node_modules/bootstrap/dist/css/bootstrap.min.css', 'src/scss/*.scss'],
    series(['scss'])
  )
  watch('src/*.html').on('change', browserSync.reload)
  return
})

task('default', series(['scss', 'js', 'fonts', 'watch']))
