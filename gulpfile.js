var browserSync     = require('browser-sync'),
    del             = require('del'),
    gulp            = require('gulp'),
    autoprefixer    = require('gulp-autoprefixer'),
    cleancss        = require('gulp-clean-css'),
    concat          = require('gulp-concat'),
    notify          = require('gulp-notify'),
    plumber         = require('gulp-plumber'),
    sass            = require('gulp-sass'),
    sourcemaps      = require('gulp-sourcemaps'),
    uglify          = require('gulp-uglify'),
    streamqueue     = require('streamqueue'),
    path            = require('path'),
    
    //input & output folders and files
    input = {
      'html':        'src/*.html',
      'base_html':   ['src/*.html', '!src/_*.html'],
      'styles':      'src/*.scss',
    },
    output = {
      'html':        'Sketch\ Commander.sketchplugin/Contents/Resources',
      'styles':      'Sketch\ Commander.sketchplugin/Contents/Resources',
    }
;

// error function for plumber
var onError = function (err) {
  browserSync.notify(err.message, 10000);
	notify.onError({title: "Error", message: err.message})(err); // error notification
	console.log(err.toString()); // prints error to console
  this.emit('end');
};

// BrowserSync proxy
gulp.task('browser-sync', function(done) {
  browserSync.init({
      server: {
        baseDir: output.html
      },
      online: false,
      open: false //true: opens in browser each time you run gulp
  });
  done()
});


// build site css
gulp.task('site:css', function(){
  return gulp.src(input.styles)
    .pipe(plumber({ errorHandler: onError }))
    // .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer(['last 2 versions'], { cascade: true }))
    .pipe(cleancss())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.styles))
    .pipe(browserSync.reload({ stream: true }))
});

// sync html 
gulp.task('sync:html', function(done) {
  return gulp.src(input.base_html)
    .pipe(gulp.dest(output.html))
    done()
});


//reload html task
gulp.task('reload', function(done){
    browserSync.reload()
    done()
})

// Server + watching files
gulp.task('watch', function() {
    gulp.watch(input.html, gulp.parallel( 'sync:html' ));
    gulp.watch(input.html, gulp.parallel( 'reload' )).on('change', function(event) {
        if(event.type === 'deleted') {
            del.sync(path.resolve(output.html, path.relative(path.resolve('source'), event.path)));
        }
    });
    gulp.watch(input.styles, gulp.parallel('site:css' ));
});

//build all task
gulp.task('build:all', gulp.parallel( 'site:css', 'sync:html' ));

//this task will run on default 'gulp' without arguments
gulp.task('default', gulp.series( 'build:all', 'browser-sync', 'watch' ));
