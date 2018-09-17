// 引入 gulp及组件
var gulp = require('gulp'),               //gulp基础库
    logSymbols = require('log-symbols'),        //log
    minifyCss = require('gulp-minify-css'),       //css压缩
    sass = require('gulp-sass'),              //scss
    plumber = require('gulp-plumber'),          //捕获处理任务中的错误
    autoprefixer = require('gulp-autoprefixer'),      //css自动加浏览器兼容前缀
    stripCssComments = require('gulp-strip-css-comments'), //css去注释
    gutil = require('gulp-util'),           //util
    mapStream = require('map-stream'),          //css格式化
    cssbeautify = require('cssbeautify'),         //css美化
    rev = require('gulp-rev'),              //对文件名加MD5后缀
    concat = require('gulp-concat'),            //合并文件
    uglify = require('gulp-uglify'),            //js压缩
    rename = require('gulp-rename'),            //文件重命名
    jshint = require('gulp-jshint'),            //js检查
    revCollector = require('gulp-rev-collector'),     //路径替换
    browserSync = require('browser-sync').create(),   //静态服务器
    notify = require('gulp-notify'),            //提示
    babel = require("gulp-babel"),
    colors = require('colors'),             //颜色
    runSequence = require('gulp-run-sequence'), //顺序执行任务
    clean = require('gulp-clean'), //清理历史文件
	del = require('del');					//删除历史文件

// MAIN PATHS
var paths = {
    output: './dist'
};

var fileOPts = {
    libCss: [
        "./node_modules/bootstrap/dist/css/bootstrap.min.css",
        "./node_modules/angular-toastr/dist/angular-toastr.min.css",
        "./node_modules/n3-charts/build/LineChart.css",
        // "./node_modules/highcharts/css/highcharts.css",
        "./node_modules/ng-dialog/css/ngDialog.min.css",
        "./node_modules/ng-dialog/css/ngDialog-theme-default.min.css",
        "./node_modules/angularjs-slider/dist/rzslider.min.css",
        "./node_modules/angularjs-datepicker/src/css/angular-datepicker.css",

        // "./node_modules/pace-js/themes/black/pace-theme-loading-bar.css",
        // "./node_modules/animate.css/animate.min.css"
    ],
    libFonts: [
        "./node_modules/bootstrap/dist/fonts/*"
    ],
    styleCss: ['assets/css/public.css','assets/css/login.css', 'assets/css/assets.css','assets/css/index.css','assets/css/address.css','assets/css/recharge.css','assets/css/news.css','assets/css/trade.css','assets/css/banner.css','assets/css/contactUs.css','assets/css/feeRate.css','assets/css/c2c.css','assets/css/tw_assets.css'],
    libJs: [
        "./node_modules/jquery/dist/jquery.min.js",
        "./node_modules/qrcode/build/qrcode.min.js",
        "./node_modules/sidr/dist/jquery.sidr.min.js",
        "./node_modules/angular/angular.min.js",
        "./node_modules/angular-ui-router/release/angular-ui-router.min.js",
        "./node_modules/angular-cookies/angular-cookies.min.js",
        "./node_modules/angular-upload/angular-upload.min.js",
        "./node_modules/angular-translate/dist/angular-translate.min.js",
        "./node_modules/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
        "./node_modules/angular-animate/angular-animate.min.js",
        // "./node_modules/gsap/TweenMax.js",
        "./node_modules/angular-gsapify-router/angular-gsapify-router.js",
        "./node_modules/angular-utils-pagination/dirPagination.js",
        "./node_modules/angular-toastr/dist/angular-toastr.tpls.min.js",
        "./node_modules/highcharts/highstock.js",
        "./node_modules/highcharts/modules/exporting.js",
        "./node_modules/bootstrap/dist/js/bootstrap.min.js",
        "./node_modules/highcharts/themes/dark-unica.js",
        "./node_modules/highcharts/modules/map.js",

        
        // "./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
        "./js/ui-bootstrap-custom-build/ui-bootstrap-custom-tpls-2.5.0.min.js",

        "./node_modules/ng-dialog/js/ngDialog.min.js",
        "./node_modules/angularjs-slider/dist/rzslider.min.js",
        "./node_modules/moment/min/moment.min.js",
        "./node_modules/moment-timezone/builds/moment-timezone-with-data-2012-2022.min.js",
        "./node_modules/angularjs-datepicker/src/js/angular-datepicker.js",
        "./node_modules/angular-dynamic-locale/src/tmhDynamicLocale.js"

        // "./node_modules/pace-js/pace.js",
    ],
    appJs: // ["js/util.js",],
        [
            "app.js",
            "config.js",
            "js/common.js",
            "js/province_city_data.js",
            "js/util.js",
            "js/detect.js",
            "./js/fileinput.min.js",
            "./js/zh.js",
            // "js/quill.js",
            "js/technical-indicators.src.js",
            "js/charting_library/datafeed/udf/datafeed.js",
            "js/charting_library/charting_library.min.js",

            "app-services/authentication.service.js",
            "app-services/flash.service.js",
            "app-services/register.service.js",
            "app-services/private.service.js",
            "app-services/news.service.js",
            "app-services/public.service.js",
            "app-services/usertoken.service.js",
            "app-services/sinapay.service.js",
            "app-services/c2c.service.js",
						"app-services/below.service.js",

            "app-helpers/print-price.js",
            "c2c/c2ctrade.controller.js",
            "c2c/c2cpersonrecord.controller.js",
            "c2c/c2crealIdentity.controller.js",

            "home/home.controller.js",
            "common/login.controller.js",
            "common/register.controller.js",
            "trade/trade.controller.js",
						"trade/trade_tc.controller.js",
            "trade/chart.controller.js",
            "account/account.controller.js",
            "account/recharge.controller.js",
            "account/withdraw.controller.js",
            "account/bankandaddress.controller.js",
            "account/dataanalysis.controller.js",
            "account/lock.controller.js",
            "setting/setting.controller.js",
            "support/support.controller.js",
            "history/history.controller.js",
            "news/news.controller.js",
            "public/menu.controller.js",
            "public/mobile.controller.js",
						"public/mobile.controller.js",
            "public/feeRate.controller.js",
						"js/jquery.reslider.js"
        ],
    view: [
        'account/*.html',
        'common/*.html',
        'help/*.html',
        'history/*.html',
        'home/*.html',
        'public/*.html',
        'trade/*.html',
        'news/*.html',
        'setting/**/*.html',
        'c2c/**/*.html'
    ],
    lang: ['lang/*.json','lang/angular-locale_*.js'],
    font: ['fonts/*','js/charting_library/static/font/*']
}

// 更新引用文件
gulp.task('rev', function () {
    return gulp.src('./index.html')
        .pipe(rev())
        .pipe(gulp.dest('./'));
});


//压缩，合并 css 引入的库
gulp.task('minifyLibCss', function () {
    return gulp.src(fileOPts.libCss)
        .pipe(concat('lib.min.css'))
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest(paths.output + '/assets/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.output + '/rev/libcss'));

});

//压缩，合并 css 定制样式
gulp.task('minifyStyleCss', function () {
    return gulp.src(fileOPts.styleCss)
        .pipe(concat('style.min.css'))
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest(paths.output + '/assets/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.output + '/rev/stylecss'));
});

//压缩，合并 js 引入的库
gulp.task('minifyLibJs', function () {
    // 需要操作的文件
    return gulp.src(fileOPts.libJs)
        .pipe(concat('lib.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(rev())
        .pipe(gulp.dest(paths.output + '/javascripts'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.output + '/rev/libjs'));
});

//压缩，合并 js 程序逻辑
gulp.task('minifyAppJs:dev', function () {
	fileOPts.appJs[1] = "share/dev/config.js";
    // 需要操作的文件
    return gulp.src(fileOPts.appJs)
        .pipe(concat('app.js'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify({mangle: false}))
        .pipe(rename({suffix: '.min'}))
        .pipe(rev())
        .pipe(gulp.dest(paths.output + '/javascripts'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.output + '/rev/appjs'));
});

gulp.task('minifyAppJs:test', function () {
	fileOPts.appJs[1] = "share/test/config.js";
    // 需要操作的文件
    return gulp.src(fileOPts.appJs)
        .pipe(concat('app.js'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify({mangle: false}))
        .pipe(rename({suffix: '.min'}))
        .pipe(rev())
        .pipe(gulp.dest(paths.output + '/javascripts'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.output + '/rev/appjs'));
});

gulp.task('minifyAppJs:master', function () {
	fileOPts.appJs[1] = "share/master/config.js";
    // 需要操作的文件
    return gulp.src(fileOPts.appJs)
        .pipe(concat('app.js'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify({mangle: false}))
        .pipe(rename({suffix: '.min'}))
        .pipe(rev())
        .pipe(gulp.dest(paths.output + '/javascripts'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.output + '/rev/appjs'));
});

//复制 view
gulp.task('view', function () {
    // 需要操作的文件
    return gulp.src(fileOPts.view,{base: './'})
        .pipe(revCollector())
        .pipe(gulp.dest(paths.output));
});

// 复制tradingview
gulp.task('tradfile', function () {
    return gulp.src('./js/charting_library/**/*',{base: './'})
        .pipe(gulp.dest(paths.output));
});
//复制语言包
gulp.task('lang', function () {
    // 需要操作的文件
    return gulp.src(fileOPts.lang, {base: './'})
        .pipe(gulp.dest(paths.output));
})

//复制font
gulp.task('font', function () {
    // 需要操作的文件
    return gulp.src(fileOPts.font, {base: './'})
        .pipe(gulp.dest(paths.output));
})

// 引入外部资源库
gulp.task('minifyLibFonts', function () {
	return gulp.src(fileOPts.libFonts)
    .pipe(gulp.dest(paths.output + '/assets/fonts'))
});

//主页编译
gulp.task('index:dev', ['minifyLibCss', 'minifyLibFonts', 'minifyStyleCss', 'minifyLibJs', 'minifyAppJs:dev'], function () {
    return gulp.src([paths.output + "/rev/**/*.json", './index_dist.html'])
        .pipe(revCollector({replaceReved: true}))
        .pipe(rename(function (path) {
            path.basename = 'index';
            path.extname = ".html";
        }))
        .pipe(gulp.dest(paths.output));
})

//主页编译
gulp.task('index:test', ['minifyLibCss', 'minifyLibFonts', 'minifyStyleCss', 'minifyLibJs', 'minifyAppJs:test'], function () {
    return gulp.src([paths.output + "/rev/**/*.json", './index_dist.html'])
        .pipe(revCollector({replaceReved: true}))
        .pipe(rename(function (path) {
            path.basename = 'index';
            path.extname = ".html";
        }))
        .pipe(gulp.dest(paths.output));
})

//主页编译
gulp.task('index:master', ['minifyLibCss', 'minifyLibFonts', 'minifyStyleCss', 'minifyLibJs', 'minifyAppJs:master'], function () {
    return gulp.src([paths.output + "/rev/**/*.json", './index_dist.html'])
        .pipe(revCollector({replaceReved: true}))
        .pipe(rename(function (path) {
            path.basename = 'index';
            path.extname = ".html";
        }))
        .pipe(gulp.dest(paths.output));
})

// 图片
gulp.task('assets', function () {
        return gulp.src('./assets/images/**/*', {base: './'})
            .pipe(gulp.dest(paths.output));
})
//trawingview
// gulp.task('jsimg', function () {
//     return gulp.src('./js/charting_library/static/images/**/*', {base: './'})
//         .pipe(gulp.dest(paths.output));
// })

gulp.task('rev', function () {
    return gulp.src([paths.output + "/rev/**/*.json", './*.html'])
        .pipe(revCollector({replaceReved: true}))
        .pipe(gulp.dest('./'));
});

// 'minifyLibCss', 'minifyStyleCss', 'minifyLibJs', 'minifyAppJs',
// gulp.task('default', ['view', 'assets', 'lang', 'font', 'index']);
//清除历史打包文件
gulp.task('clean:dist', function (cb) {
	return gulp.src('dist/*').pipe(clean());
//	  del([
//	    './dist/*',
//	  ], cb);
});
// gulp.task('default', function(cb) {
//   runSequence('clean:dist', ['view', 'assets', 'lang', 'font', 'index'], cb);
// });
//
// gulp.task('test', function(cb) {
//     runSequence('clean:dist', ['view', 'assets', 'lang', 'font', 'index'], cb);
// });
//
// gulp.task('master', function(cb) {
//     runSequence('clean:dist', ['view', 'assets', 'lang', 'font', 'index'], cb);
// });

gulp.task('share:master', function () {
    return gulp.src('./share/master/**/*', {base: './share/master/'})
        .pipe(gulp.dest(paths.output));
})



gulp.task('share:test', function () {
    return gulp.src('./share/test/**/*', {base: './share/test'})
        .pipe(gulp.dest(paths.output));
})
gulp.task('share:dev', function () {
    return gulp.src('./share/dev/**/*', {base: './share/dev/'})
        .pipe(gulp.dest(paths.output));
})
// gulp.task('default',['view','clean:dist', 'assets', 'lang', 'font', 'index','share:master'])
// gulp.task('test' ['view','clean:dist', 'assets', 'lang', 'font', 'index','share:test'])
// gulp.task('dev',['view','clean:dist', 'assets', 'lang', 'font', 'index','share:dev'])
gulp.task('default', function(cb) {
  runSequence('clean:dist', ['view', 'assets', 'lang', 'font','tradfile', 'index:master','share:master'], cb);
});
gulp.task('dev', function(cb) {
    runSequence('clean:dist', ['view', 'assets', 'lang', 'font','tradfile', 'index:dev','share:dev'], cb);
});
gulp.task('test', function(cb) {
    runSequence('clean:dist', ['view', 'assets', 'lang', 'font','tradfile', 'index:test','share:test'], cb);
});

//gulp.task('default',['clean:dist'])
//gulp.task('default', ['clean:dist']);
//gulp.task('default', ['view', 'assets', 'lang', 'font', 'index']);
// gulp.task('default', ['minifyAppJs']);
