import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import sass from 'gulp-sass';
import runSequence from 'run-sequence';
import rimraf from 'rimraf';
import watch from 'gulp-watch';
import webpack from 'webpack';
import browserSync from 'browser-sync';
import gutil from 'gulp-util';

//HTML MINIFICADO
gulp.task('html',() => {
  console.log('HTML MINIFICADO!');
  return gulp.src('./src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/'))
});

//DE SASS PARA CSS
gulp.task('css',() => {
  console.log('CSS MINIFICADO!');
  return gulp.src('./src/css/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('js',(callback) => {
  let config = require('./webpack.config');
  let callbackAlreadyCalled = false;
  webpack(config, (err, stat) => {
    gutil.log(stat.compilation.errors.toString());
    gutil.log(stat.compilation.warnings.toString());

    if(!callbackAlreadyCalled){
      callbackAlreadyCalled = true;
      callback();
    }
  });
});

//TESTAR NO NAVEGADOR
gulp.task('browser-sync',() => {
  browserSync({
    files:['./dist/**/*'],
    server:{
      baseDir: './dist/'
    }
  });
});

//SEQUENCIA TASKS A SER RODADAS
gulp.task('build',(callback) => {
   console.log('Rodando tasks!');
   runSequence('del',['html','css'],'js','browser-sync','watch',callback);
});

//EXCLUIR PASTA
gulp.task('del',(callback) => {
  rimraf('./dist/',callback);
  console.log('Pasta Excluida!');
});

//MONITORAMENTO
gulp.task('watch',() => {
    watch('./src/*.html',() => {
      runSequence('html');
    });
    watch('./src/**/*.css',() => {
      runSequence('scss');
    });
    watch('./src/**/*.js',() => {
      runSequence('js');
    });
});
