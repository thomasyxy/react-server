"use strict";
const koa = require('koa');
const convert = require('koa-convert');
const app = new koa();
const Jade = require('koa-jade');
const staticCache = require('koa-static-cache');
const webpack = require('webpack');
const ora = require('ora');
const routes = require('./config/routes');
const webpackConfig = require('./webpack.config');

const port = 5000;

//静态资源文件
app.use(convert(staticCache('./static', {
  maxAge: 0
})));

const jade = new Jade({
  viewPath: __dirname + "/views",
  debug: true,
  pretty: true,
  compileDebug: false,
  locals: {
    staticPath: '/static'
  },
  app: app
});


//路由
app.use(convert(routes()));

app.use(convert(function*(next) {
  yield next
  if (404 !== this.status) return;
  this.status = 404;
  this.render('404', {
    msg: 'Not Found'
  })
}));

function toBuild() {
  let spinner = ora('building for production...')
  spinner.start()

  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
  })
};

toBuild();

app.listen(port, (err) => {
	if(err){
		console.log(err);
		return false;
	}
	console.log(`> listen at: http://127.0.0.1:${port}`);
});
