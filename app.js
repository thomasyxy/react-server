"use strict"
const koa = require('koa')
const convert = require('koa-convert')
const app = new koa()
const Jade = require('koa-jade')
const staticCache = require('koa-static-cache');
const webpack = require('webpack');
const ora = require('ora')
const routes = require('./config/routes')
const webpackConfig = require('./webpack.config')

const port = 5000

//静态资源文件
app.use(convert(staticCache('./static', {
  maxAge: 0
})))

const jade = new Jade({
  viewPath: __dirname + "/views",
  debug: true,
  pretty: true,
  compileDebug: false,
  locals: {
    staticPath: '/static'
  },
  app: app
})

//路由
app.use(convert(routes()))

app.use(convert(function*(next) {
  yield next
  if (404 !== this.status) return
  this.status = 404
  this.render('404', {
    msg: 'Not Found'
  })
}))

const spinner = ora('building...')
spinner.start()

function webpackBuild() {
  const compiler = webpack(webpackConfig, () => {
    spinner.stop()
  })
  const devMiddleware = require("koa-webpack-dev-middleware")(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })

  const hotMiddleware = require('koa-webpack-hot-middleware')(compiler)

  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      hotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })

  app.use(convert(devMiddleware))

  app.use(convert(hotMiddleware))
}

webpackBuild()

app.listen(port, (err) => {
	if(err){
		console.log(err)
		return false
	}
	console.log(`> listen at: http://127.0.0.1:${port}`)
})
