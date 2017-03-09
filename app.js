"use strict";
const koa = require('koa');
const convert = require('koa-convert');
const app = new koa();
const routes = require('./config/routes');

const port = 5000;

//路由
app.use(convert(routes()));

app.listen(port, (err) => {
	if(err){
		console.log(err);
		return false;
	}
	console.log(`> listen at: http://127.0.0.1:${port}`);
})
